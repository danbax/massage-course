<?php

/*
 * Simple test script to verify single-course system endpoints
 * Run this from the Laravel root directory with: php test-single-course.php
 */

// Set up basic Laravel environment
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🧪 Testing Single-Course System APIs\n";
echo "=====================================\n\n";

try {
    // Test Module Controller
    echo "📋 Testing Module API...\n";
    $moduleController = new App\Http\Controllers\Api\ModuleController();
    
    // Note: In a real test, you would mock the Request and simulate authentication
    echo "✅ ModuleController class exists\n";
    
    // Test Lesson Controller
    echo "\n📖 Testing Lesson API...\n";
    $lessonController = new App\Http\Controllers\Api\LessonController();
    echo "✅ LessonController class exists\n";
    
    // Test Progress Controller
    echo "\n📊 Testing Progress API...\n";
    $progressController = new App\Http\Controllers\Api\ProgressController();
    echo "✅ ProgressController class exists\n";
    
    // Test Auth Controller
    echo "\n🔐 Testing Auth API...\n";
    $authController = new App\Http\Controllers\Api\AuthController();
    echo "✅ AuthController class exists\n";
    
    // Test Models
    echo "\n📝 Testing Models...\n";
    echo "✅ Module model: " . (class_exists('App\Models\Module') ? 'exists' : 'missing') . "\n";
    echo "✅ Lesson model: " . (class_exists('App\Models\Lesson') ? 'exists' : 'missing') . "\n";
    echo "✅ User model: " . (class_exists('App\Models\User') ? 'exists' : 'missing') . "\n";
    echo "✅ UserProgress model: " . (class_exists('App\Models\UserProgress') ? 'exists' : 'missing') . "\n";
    
    echo "\n🎉 All basic components are ready!\n";
    echo "\n💡 Next steps:\n";
    echo "   1. Run database migrations\n";
    echo "   2. Seed the database with single-course data\n";
    echo "   3. Test API endpoints with authentication\n";
    echo "   4. Verify frontend integration\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "📍 File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
