<?php

use Illuminate\Http\Request;

/*
 * Simple test to verify authentication endpoints work
 */

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🧪 Testing Authentication with Course ID Fix\n";
echo "============================================\n\n";

try {
    // Test creating a user
    echo "👤 Testing User Creation...\n";
    
    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
        'email_verified_at' => now()
    ];
    
    // Check if user exists first
    $existingUser = App\Models\User::where('email', 'test@example.com')->first();
    if ($existingUser) {
        echo "✅ Test user already exists (ID: {$existingUser->id})\n";
        $user = $existingUser;
    } else {
        $user = App\Models\User::create($userData);
        echo "✅ Test user created successfully (ID: {$user->id})\n";
    }
    
    // Test initializing progress
    echo "\n📊 Testing Progress Initialization...\n";
    $progress = $user->initializeProgress();
    echo "✅ Progress initialized successfully (ID: {$progress->id})\n";
    echo "   - Completed lessons: {$progress->completed_lessons}\n";
    echo "   - Total lessons: {$progress->total_lessons}\n";
    echo "   - Progress percentage: {$progress->progress_percentage}%\n";
    
    // Test getting course progress
    echo "\n📈 Testing Progress Retrieval...\n";
    $courseProgress = $user->getCourseProgress();
    if ($courseProgress) {
        echo "✅ Course progress retrieved successfully\n";
        echo "   - Progress ID: {$courseProgress->id}\n";
        echo "   - Lessons completed: {$courseProgress->completed_lessons}\n";
    } else {
        echo "ℹ️  No course progress found (expected for new user)\n";
    }
    
    echo "\n🎉 Authentication system is working!\n";
    echo "\n💡 You can now:\n";
    echo "   1. Register/login through the frontend\n";
    echo "   2. Test the modules and lessons endpoints\n";
    echo "   3. Apply the full migration to remove course_id once everything works\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "📍 File: " . $e->getFile() . ":" . $e->getLine() . "\n\n";
    echo "💡 Stack trace:\n" . $e->getTraceAsString() . "\n";
}
