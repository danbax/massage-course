<?php

/*
 * Test modules API endpoint
 */

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🧪 Testing Modules API\n";
echo "=====================\n\n";

try {
    // Get all modules
    echo "📋 Testing Module data...\n";
    $modules = App\Models\Module::with('lessons')->orderBy('order')->get();
    
    echo "✅ Found {$modules->count()} modules:\n\n";
    
    foreach ($modules as $module) {
        echo "📚 Module {$module->order}: {$module->title}\n";
        echo "   Description: " . substr($module->description, 0, 60) . "...\n";
        echo "   Duration: {$module->duration_minutes} minutes\n";
        echo "   Lessons: {$module->lessons->count()}\n";
        
        foreach ($module->lessons as $lesson) {
            echo "   📖 {$lesson->order}. {$lesson->title} ({$lesson->duration_minutes}min)\n";
        }
        echo "\n";
    }
    
    echo "🎉 Module and lesson data is ready!\n";
    echo "\n💡 Next steps:\n";
    echo "   1. Test authentication endpoints\n";
    echo "   2. Test the frontend integration\n";
    echo "   3. Test progress tracking\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "📍 File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
