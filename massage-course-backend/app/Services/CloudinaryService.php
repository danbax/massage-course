<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    private $cloudName;
    private $apiKey;
    private $apiSecret;
    private $baseUrl;

    public function __construct()
    {
        $this->cloudName = config('cloudinary.cloud_name');
        $this->apiKey = config('cloudinary.api_key');
        $this->apiSecret = config('cloudinary.api_secret');
        $this->baseUrl = "https://api.cloudinary.com/v1_1/{$this->cloudName}";
    }

    /**
     * Upload a video file to Cloudinary
     */
    public function uploadVideo(UploadedFile $file, string $publicId = null, array $options = []): array
    {
        try {
            $timestamp = time();
            $folder = config('cloudinary.folder', 'massage-course');
            
            // Set default options
            $defaultOptions = [
                'resource_type' => 'video',
                'folder' => $folder,
                'timestamp' => $timestamp,
                'overwrite' => config('cloudinary.overwrite', true),
                'invalidate' => config('cloudinary.invalidate', true),
                'quality' => config('cloudinary.default_quality', 'auto:good'),
                'format' => config('cloudinary.default_video_format', 'mp4'),
            ];

            if ($publicId) {
                $defaultOptions['public_id'] = $publicId;
            }

            $uploadOptions = array_merge($defaultOptions, $options);

            // Generate signature
            $signature = $this->generateSignature($uploadOptions);
            $uploadOptions['signature'] = $signature;
            $uploadOptions['api_key'] = $this->apiKey;

            // Prepare the multipart form data
            $response = Http::attach(
                'file', 
                file_get_contents($file->getPathname()), 
                $file->getClientOriginalName()
            )->post("{$this->baseUrl}/video/upload", $uploadOptions);

            if ($response->failed()) {
                throw new \Exception('Cloudinary upload failed: ' . $response->body());
            }

            $result = $response->json();

            Log::info('Video uploaded to Cloudinary successfully', [
                'public_id' => $result['public_id'],
                'secure_url' => $result['secure_url'],
                'duration' => $result['duration'] ?? null,
            ]);

            return $result;

        } catch (\Exception $e) {
            Log::error('Cloudinary video upload failed', [
                'error' => $e->getMessage(),
                'file' => $file->getClientOriginalName(),
            ]);
            throw $e;
        }
    }

    /**
     * Delete a video from Cloudinary
     */
    public function deleteVideo(string $publicId): bool
    {
        try {
            $timestamp = time();
            $params = [
                'public_id' => $publicId,
                'resource_type' => 'video',
                'timestamp' => $timestamp,
                'api_key' => $this->apiKey,
            ];

            $signature = $this->generateSignature($params);
            $params['signature'] = $signature;

            $response = Http::asForm()->post("{$this->baseUrl}/video/destroy", $params);

            if ($response->failed()) {
                throw new \Exception('Cloudinary delete failed: ' . $response->body());
            }

            $result = $response->json();

            Log::info('Video deleted from Cloudinary', [
                'public_id' => $publicId,
                'result' => $result['result'] ?? 'unknown',
            ]);

            return ($result['result'] ?? '') === 'ok';

        } catch (\Exception $e) {
            Log::error('Cloudinary video deletion failed', [
                'error' => $e->getMessage(),
                'public_id' => $publicId,
            ]);
            return false;
        }
    }

    /**
     * Get video information from Cloudinary
     */
    public function getVideoInfo(string $publicId): ?array
    {
        try {
            $timestamp = time();
            $params = [
                'timestamp' => $timestamp,
                'api_key' => $this->apiKey,
            ];

            $signature = $this->generateSignature($params);
            $params['signature'] = $signature;

            $response = Http::get("{$this->baseUrl}/video/upload/{$publicId}", $params);

            if ($response->failed()) {
                return null;
            }

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Failed to get Cloudinary video info', [
                'error' => $e->getMessage(),
                'public_id' => $publicId,
            ]);
            return null;
        }
    }

    /**
     * Generate video URL with transformations
     */
    public function generateVideoUrl(string $publicId, array $transformations = []): string
    {
        $baseUrl = "https://res.cloudinary.com/{$this->cloudName}/video/upload";
        
        if (empty($transformations)) {
            $transformations = config('cloudinary.video_transformations.standard');
        }

        $transformationString = $this->buildTransformationString($transformations);
        
        if ($transformationString) {
            return "{$baseUrl}/{$transformationString}/{$publicId}";
        }

        return "{$baseUrl}/{$publicId}";
    }

    /**
     * Generate thumbnail URL for video
     */
    public function generateThumbnailUrl(string $publicId, array $transformations = []): string
    {
        $baseUrl = "https://res.cloudinary.com/{$this->cloudName}/video/upload";
        
        if (empty($transformations)) {
            $transformations = config('cloudinary.video_transformations.thumbnail');
        }

        $transformationString = $this->buildTransformationString($transformations);
        
        if ($transformationString) {
            return "{$baseUrl}/{$transformationString}/{$publicId}.jpg";
        }

        return "{$baseUrl}/{$publicId}.jpg";
    }

    /**
     * Extract public ID from Cloudinary URL
     */
    public function extractPublicId(string $url): ?string
    {
        // Handle various Cloudinary URL formats
        $patterns = [
            // Standard video URL: https://res.cloudinary.com/cloudname/video/upload/v1234567890/folder/video_name.mp4
            '/\/video\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/',
            // Raw URL: https://res.cloudinary.com/cloudname/raw/upload/v1234567890/folder/video_name.mp4
            '/\/raw\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/',
            // Image URL: https://res.cloudinary.com/cloudname/image/upload/v1234567890/folder/video_name.mp4
            '/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        // If no pattern matches, assume it's already a public ID
        return preg_replace('/\.[^.]*$/', '', $url); // Remove file extension if present
    }

    /**
     * Generate signature for Cloudinary API requests
     */
    private function generateSignature(array $params): string
    {
        // Remove signature and api_key from params for signature generation
        unset($params['signature'], $params['api_key']);
        
        // Sort parameters alphabetically
        ksort($params);
        
        // Build query string
        $queryString = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
        
        // Append API secret
        $queryString .= $this->apiSecret;
        
        // Generate SHA1 hash
        return sha1($queryString);
    }

    /**
     * Build transformation string from array
     */
    private function buildTransformationString(array $transformations): string
    {
        $parts = [];

        foreach ($transformations as $key => $value) {
            switch ($key) {
                case 'width':
                    $parts[] = "w_{$value}";
                    break;
                case 'height':
                    $parts[] = "h_{$value}";
                    break;
                case 'quality':
                    $parts[] = "q_{$value}";
                    break;
                case 'format':
                    if ($value !== 'auto') {
                        $parts[] = "f_{$value}";
                    }
                    break;
                case 'crop':
                    $parts[] = "c_{$value}";
                    break;
                default:
                    if (is_string($value)) {
                        $parts[] = "{$key}_{$value}";
                    }
                    break;
            }
        }

        return implode(',', $parts);
    }

    /**
     * Test Cloudinary connection
     */
    public function testConnection(): bool
    {
        try {
            $timestamp = time();
            $params = [
                'timestamp' => $timestamp,
                'api_key' => $this->apiKey,
            ];

            $signature = $this->generateSignature($params);
            $params['signature'] = $signature;

            $response = Http::get("{$this->baseUrl}/resources/video", $params);

            return $response->successful();

        } catch (\Exception $e) {
            Log::error('Cloudinary connection test failed', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
