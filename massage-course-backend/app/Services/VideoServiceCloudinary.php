<?php

namespace App\Services;

use App\Models\Lesson;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VideoServiceCloudinary
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Upload and process a video file
     */
    public function uploadVideo($videoFile, Lesson $lesson): string
    {
        try {
            // Generate a unique public ID for the video
            $publicId = $this->generateVideoPublicId($lesson);
            
            // Upload to Cloudinary
            $result = $this->cloudinaryService->uploadVideo($videoFile, $publicId, [
                'tags' => ['lesson', "lesson_{$lesson->id}", $lesson->module->title ?? 'massage-course'],
                'context' => [
                    'lesson_id' => $lesson->id,
                    'module_id' => $lesson->module_id,
                    'title' => $lesson->title,
                ]
            ]);
            
            // Update lesson with Cloudinary URL and metadata
            $lesson->update([
                'video_url' => $result['public_id'], // Store public ID instead of full URL
                'video_duration' => $result['duration'] ?? null,
            ]);

            Log::info('Video uploaded to Cloudinary successfully', [
                'lesson_id' => $lesson->id,
                'public_id' => $result['public_id'],
                'duration' => $result['duration'] ?? null,
            ]);

            return $result['public_id'];
        } catch (\Exception $e) {
            Log::error('Video upload failed', [
                'lesson_id' => $lesson->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Generate a secure video streaming URL (for Cloudinary, we return the public ID)
     */
    public function generateSecureVideoUrl(Lesson $lesson, User $user): string
    {
        // Check if user has access to this lesson
        if (!$this->userHasAccess($user, $lesson)) {
            throw new \Exception('User does not have access to this video');
        }

        // For Cloudinary videos, we return the public ID
        // The frontend will handle generating the actual URL with transformations
        return $lesson->video_url;
    }

    /**
     * Get video metadata from Cloudinary
     */
    public function getVideoMetadata(Lesson $lesson): array
    {
        if (!$lesson->video_url) {
            return [];
        }

        $publicId = $this->cloudinaryService->extractPublicId($lesson->video_url);
        $videoInfo = $this->cloudinaryService->getVideoInfo($publicId);
        
        if (!$videoInfo) {
            return [];
        }

        return [
            'duration' => $videoInfo['duration'] ?? null,
            'width' => $videoInfo['width'] ?? null,
            'height' => $videoInfo['height'] ?? null,
            'format' => $videoInfo['format'] ?? null,
            'bytes' => $videoInfo['bytes'] ?? null,
            'url' => $this->cloudinaryService->generateVideoUrl($publicId),
            'thumbnail_url' => $this->cloudinaryService->generateThumbnailUrl($publicId),
            'created_at' => $videoInfo['created_at'] ?? null,
        ];
    }

    /**
     * Delete video file from Cloudinary
     */
    public function deleteVideo(Lesson $lesson): bool
    {
        try {
            if (!$lesson->video_url) {
                return true;
            }

            $publicId = $this->cloudinaryService->extractPublicId($lesson->video_url);
            $deleted = $this->cloudinaryService->deleteVideo($publicId);

            if ($deleted) {
                $lesson->update([
                    'video_url' => null,
                    'video_duration' => null,
                ]);

                Log::info('Video deleted successfully', [
                    'lesson_id' => $lesson->id,
                    'public_id' => $publicId,
                ]);
            }

            return $deleted;
        } catch (\Exception $e) {
            Log::error('Video deletion failed', [
                'lesson_id' => $lesson->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get video quality options (Cloudinary handles this automatically)
     */
    public function getVideoQualities(Lesson $lesson): array
    {
        // With Cloudinary, we can provide different quality options
        return ['high', 'standard', 'mobile'];
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
                'watch_time_seconds' => max($lessonProgress->watch_time_seconds ?? 0, $watchedSeconds),
                'updated_at' => now(),
            ]);
        }

        Log::info('Video progress tracked', [
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'watched_seconds' => $watchedSeconds,
        ]);
    }

    /**
     * Generate public ID for uploaded video
     */
    private function generateVideoPublicId(Lesson $lesson): string
    {
        $folder = config('cloudinary.folder', 'massage-course');
        $moduleSlug = Str::slug($lesson->module->title ?? 'module');
        $lessonSlug = Str::slug($lesson->title ?? "lesson-{$lesson->id}");
        
        return "{$folder}/lessons/{$moduleSlug}/{$lessonSlug}-{$lesson->id}";
    }

    /**
     * Check if user has access to the lesson
     */
    private function userHasAccess(User $user, Lesson $lesson): bool
    {
        // For now, we'll allow all authenticated users access
        // You can implement more sophisticated access control here
        return $user !== null;
    }

    /**
     * Generate video URL with specific quality
     */
    public function generateVideoUrl(Lesson $lesson, string $quality = 'standard'): ?string
    {
        if (!$lesson->video_url) {
            return null;
        }

        $publicId = $this->cloudinaryService->extractPublicId($lesson->video_url);
        $transformations = config("cloudinary.video_transformations.{$quality}", 
                                 config('cloudinary.video_transformations.standard'));
        
        return $this->cloudinaryService->generateVideoUrl($publicId, $transformations);
    }

    /**
     * Generate thumbnail URL for video
     */
    public function generateThumbnailUrl(Lesson $lesson): ?string
    {
        if (!$lesson->video_url) {
            return null;
        }

        $publicId = $this->cloudinaryService->extractPublicId($lesson->video_url);
        return $this->cloudinaryService->generateThumbnailUrl($publicId);
    }

    /**
     * Test Cloudinary connection
     */
    public function testCloudinaryConnection(): bool
    {
        return $this->cloudinaryService->testConnection();
    }
}
