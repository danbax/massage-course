<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Here you can configure your Cloudinary settings for video hosting
    | and image transformations.
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME', 'Root'),
    'api_key' => env('CLOUDINARY_API_KEY', '883367577424919'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'secure' => env('CLOUDINARY_SECURE', true),
    
    /*
    |--------------------------------------------------------------------------
    | Upload Settings
    |--------------------------------------------------------------------------
    */
    
    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'ml_default'),
    'folder' => env('CLOUDINARY_FOLDER', 'massage-course'),
    
    /*
    |--------------------------------------------------------------------------
    | Video Transformations
    |--------------------------------------------------------------------------
    */
    
    'video_transformations' => [
        'standard' => [
            'quality' => 'auto:good',
            'format' => 'auto',
            'width' => 1280,
            'height' => 720,
        ],
        'high' => [
            'quality' => 'auto:best',
            'format' => 'auto',
            'width' => 1920,
            'height' => 1080,
        ],
        'mobile' => [
            'quality' => 'auto:eco',
            'format' => 'auto',
            'width' => 854,
            'height' => 480,
        ],
        'thumbnail' => [
            'quality' => 'auto:low',
            'format' => 'jpg',
            'width' => 400,
            'height' => 250,
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Default Video Settings
    |--------------------------------------------------------------------------
    */
    
    'default_video_format' => 'mp4',
    'default_quality' => 'auto:good',
    'auto_tagging' => true,
    'overwrite' => true,
    'invalidate' => true,
];
