<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudinaryService;
use App\Services\VideoServiceCloudinary;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CloudinaryController extends Controller
{
    protected $cloudinaryService;
    protected $videoService;

    public function __construct(CloudinaryService $cloudinaryService, VideoServiceCloudinary $videoService)
    {
        $this->cloudinaryService = $cloudinaryService;
        $this->videoService = $videoService;
    }

    /**
     * Test Cloudinary connection
     */
    public function testConnection()
    {
        try {
            $isConnected = $this->cloudinaryService->testConnection();
            
            return response()->json([
                'success' => $isConnected,
                'message' => $isConnected ? 'Cloudinary connection successful' : 'Cloudinary connection failed',
                'config' => [
                    'cloud_name' => config('cloudinary.cloud_name'),
                    'api_key' => config('cloudinary.api_key'),
                    'secure' => config('cloudinary.secure'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload video to Cloudinary
     */
    public function uploadVideo(Request $request)
    {
        $request->validate([
            'video' => 'required|mimes:mp4,mov,avi,wmv|max:512000', // 500MB max
            'lesson_id' => 'required|exists:lessons,id'
        ]);

        try {
            $lesson = Lesson::findOrFail($request->lesson_id);
            $publicId = $this->videoService->uploadVideo($request->file('video'), $lesson);

            return response()->json([
                'success' => true,
                'message' => 'Video uploaded successfully',
                'data' => [
                    'public_id' => $publicId,
                    'lesson_id' => $lesson->id,
                    'video_url' => $lesson->fresh()->video_url,
                    'metadata' => $this->videoService->getVideoMetadata($lesson->fresh())
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Video upload failed', [
                'error' => $e->getMessage(),
                'lesson_id' => $request->lesson_id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Video upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get video metadata
     */
    public function getVideoMetadata(Lesson $lesson)
    {
        try {
            $metadata = $this->videoService->getVideoMetadata($lesson);
            
            return response()->json([
                'success' => true,
                'data' => $metadata
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get video metadata: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete video from Cloudinary
     */
    public function deleteVideo(Lesson $lesson)
    {
        try {
            $deleted = $this->videoService->deleteVideo($lesson);
            
            return response()->json([
                'success' => $deleted,
                'message' => $deleted ? 'Video deleted successfully' : 'Failed to delete video'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Video deletion failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate video URLs with different qualities
     */
    public function generateVideoUrls(Lesson $lesson)
    {
        try {
            if (!$lesson->video_url) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lesson has no video'
                ], 404);
            }

            $publicId = $this->cloudinaryService->extractPublicId($lesson->video_url);
            $urls = [];

            foreach (['high', 'standard', 'mobile'] as $quality) {
                $transformations = config("cloudinary.video_transformations.{$quality}");
                $urls[$quality] = $this->cloudinaryService->generateVideoUrl($publicId, $transformations);
            }

            $urls['thumbnail'] = $this->cloudinaryService->generateThumbnailUrl($publicId);

            return response()->json([
                'success' => true,
                'data' => [
                    'public_id' => $publicId,
                    'urls' => $urls
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate URLs: ' . $e->getMessage()
            ], 500);
        }
    }
}
