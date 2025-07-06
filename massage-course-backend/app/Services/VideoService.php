<?php

namespace App\Services;

use App\Models\Lesson;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VideoService
{
    /**
     * Upload and process a video file
     */
    public function uploadVideo($videoFile, Lesson $lesson): string
    {
        try {
            $filename = $this->generateVideoFilename($videoFile, $lesson);
            $path = $videoFile->storeAs('videos/lessons', $filename, 'public');
            
            // Update lesson with video path
            $lesson->update([
                'video_url' => Storage::url($path),
                'video_duration' => $this->getVideoDuration($path),
            ]);

            Log::info('Video uploaded successfully', [
                'lesson_id' => $lesson->id,
                'video_path' => $path,
            ]);

            return $path;
        } catch (\Exception $e) {
            Log::error('Video upload failed', [
                'lesson_id' => $lesson->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Generate a secure video streaming URL
     */
    public function generateSecureVideoUrl(Lesson $lesson, User $user): string
    {
        // Check if user has access to this lesson
        if (!$this->userHasAccess($user, $lesson)) {
            throw new \Exception('User does not have access to this video');
        }

        // Generate a temporary signed URL (expires in 2 hours)
        $expiration = now()->addHours(2);
        $token = $this->generateVideoToken($lesson, $user, $expiration);
        
        return route('video.stream', [
            'lesson' => $lesson->id,
            'token' => $token,
            'expires' => $expiration->timestamp,
        ]);
    }

    /**
     * Stream video with access control
     */
    public function streamVideo(Lesson $lesson, User $user, string $token, int $expires): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        // Verify token and expiration
        if (!$this->verifyVideoToken($lesson, $user, $token, $expires)) {
            throw new \Exception('Invalid or expired video token');
        }

        $videoPath = $this->getVideoPath($lesson);
        
        if (!Storage::disk('public')->exists($videoPath)) {
            throw new \Exception('Video file not found');
        }

        return $this->createStreamedResponse($videoPath);
    }

    /**
     * Get video metadata
     */
    public function getVideoMetadata(Lesson $lesson): array
    {
        $videoPath = $this->getVideoPath($lesson);
        
        if (!Storage::disk('public')->exists($videoPath)) {
            return [];
        }

        return [
            'duration' => $this->getVideoDuration($videoPath),
            'size' => Storage::disk('public')->size($videoPath),
            'mime_type' => mime_content_type(Storage::disk('public')->path($videoPath)) ?: 'video/mp4',
            'url' => $lesson->video_url,
        ];
    }

    /**
     * Delete video file
     */
    public function deleteVideo(Lesson $lesson): bool
    {
        try {
            $videoPath = $this->getVideoPath($lesson);
            
            if (Storage::disk('public')->exists($videoPath)) {
                Storage::disk('public')->delete($videoPath);
            }

            $lesson->update([
                'video_url' => null,
                'video_duration' => null,
            ]);

            Log::info('Video deleted successfully', [
                'lesson_id' => $lesson->id,
                'video_path' => $videoPath,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Video deletion failed', [
                'lesson_id' => $lesson->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get video quality options
     */
    public function getVideoQualities(Lesson $lesson): array
    {
        $qualities = ['720p', '480p', '360p'];
        $availableQualities = [];

        foreach ($qualities as $quality) {
            $qualityPath = $this->getQualityVideoPath($lesson, $quality);
            if (Storage::disk('public')->exists($qualityPath)) {
                $availableQualities[] = $quality;
            }
        }

        return $availableQualities;
    }

    /**
     * Process video for multiple qualities
     */
    public function processVideoQualities(Lesson $lesson): void
    {
        // This would typically use a queue job for processing
        // For now, we'll just log the processing request
        Log::info('Video quality processing requested', [
            'lesson_id' => $lesson->id,
        ]);

        // In a real implementation, you would:
        // 1. Queue a job to process the video
        // 2. Use FFmpeg or similar to create different quality versions
        // 3. Store each quality version
        // 4. Update the lesson with available qualities
    }

    /**
     * Track video viewing progress
     */
    public function trackVideoProgress(User $user, Lesson $lesson, int $watchedSeconds): void
    {
        $lessonProgress = $user->lessonProgress()
            ->where('lesson_id', $lesson->id)
            ->first();

        if ($lessonProgress) {
            $lessonProgress->update([
                'watched_duration' => max($lessonProgress->watched_duration, $watchedSeconds),
                'last_watched_at' => now(),
            ]);
        }

        Log::info('Video progress tracked', [
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'watched_seconds' => $watchedSeconds,
        ]);
    }

    /**
     * Generate filename for uploaded video
     */
    private function generateVideoFilename($videoFile, Lesson $lesson): string
    {
        $extension = $videoFile->getClientOriginalExtension();
        return "lesson_{$lesson->id}_" . Str::random(10) . ".{$extension}";
    }

    /**
     * Check if user has access to the lesson
     */
    private function userHasAccess(User $user, Lesson $lesson): bool
    {
        return $user->enrolledCourses()
            ->where('course_id', $lesson->module->course_id)
            ->exists();
    }

    /**
     * Generate a secure token for video access
     */
    private function generateVideoToken(Lesson $lesson, User $user, $expiration): string
    {
        $data = implode('|', [
            $lesson->id,
            $user->id,
            $expiration->timestamp,
        ]);

        return hash_hmac('sha256', $data, config('app.key'));
    }

    /**
     * Verify video access token
     */
    private function verifyVideoToken(Lesson $lesson, User $user, string $token, int $expires): bool
    {
        // Check if token has expired
        if (now()->timestamp > $expires) {
            return false;
        }

        // Regenerate token and compare
        $expectedToken = $this->generateVideoToken($lesson, $user, \Carbon\Carbon::createFromTimestamp($expires));
        
        return hash_equals($expectedToken, $token);
    }

    /**
     * Get video file path from lesson
     */
    private function getVideoPath(Lesson $lesson): string
    {
        if (!$lesson->video_url) {
            throw new \Exception('Lesson has no video');
        }

        // Extract path from URL
        return str_replace('/storage/', '', parse_url($lesson->video_url, PHP_URL_PATH));
    }

    /**
     * Get quality-specific video path
     */
    private function getQualityVideoPath(Lesson $lesson, string $quality): string
    {
        $originalPath = $this->getVideoPath($lesson);
        $pathInfo = pathinfo($originalPath);
        
        return $pathInfo['dirname'] . '/' . $pathInfo['filename'] . "_{$quality}." . $pathInfo['extension'];
    }

    /**
     * Get video duration in seconds
     */
    private function getVideoDuration(string $path): ?int
    {
        // In a real implementation, you would use FFmpeg or similar
        // to get the actual video duration
        // For now, return null
        return null;
    }

    /**
     * Create a streamed response for video
     */
    private function createStreamedResponse(string $videoPath): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $fullPath = Storage::disk('public')->path($videoPath);
        $size = filesize($fullPath);
        $mimeType = mime_content_type($fullPath) ?: 'video/mp4';

        return response()->stream(function () use ($fullPath) {
            $stream = fopen($fullPath, 'rb');
            fpassthru($stream);
            fclose($stream);
        }, 200, [
            'Content-Type' => $mimeType,
            'Content-Length' => $size,
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'no-cache, must-revalidate',
        ]);
    }
}
