<?php
/**
 * Quick Test Validation Script
 * 
 * This script performs a quick validation of the test setup
 * and provides diagnostics information.
 */

echo "=== Massage Course API - Test Setup Validation ===\n\n";

// Check if we're in the right directory
if (!file_exists('artisan')) {
    echo "❌ Error: Not in Laravel project directory\n";
    echo "Please run this script from the massage-course-backend directory\n";
    exit(1);
}

echo "✅ Laravel project directory confirmed\n";

// Check vendor directory
if (!is_dir('vendor')) {
    echo "❌ Error: vendor directory not found\n";
    echo "Please run: composer install\n";
    exit(1);
}

echo "✅ Vendor directory exists\n";

// Check if .env file exists
if (!file_exists('.env')) {
    echo "⚠️  Warning: .env file not found\n";
    echo "Please copy .env.example to .env and configure it\n";
} else {
    echo "✅ .env file exists\n";
}

// Check test files
$testFiles = [
    'tests/Feature/Api/AuthControllerTest.php',
    'tests/Feature/Api/CourseControllerTest.php',
    'tests/Feature/Api/LessonControllerTest.php',
    'tests/Feature/Api/ProgressControllerTest.php',
    'tests/Feature/Api/PaymentControllerTestFixed.php',
    'tests/Feature/Api/ProfileControllerTest.php',
    'tests/Feature/Api/CertificateControllerTest.php',
    'tests/Feature/Api/SettingsControllerTest.php',
    'tests/Feature/Api/GeneralApiTest.php',
    'tests/Feature/Api/ComprehensiveApiTest.php'
];

echo "\nTest Files Status:\n";
echo str_repeat("-", 40) . "\n";

$missingFiles = 0;
foreach ($testFiles as $file) {
    if (file_exists($file)) {
        echo "✅ {$file}\n";
    } else {
        echo "❌ {$file}\n";
        $missingFiles++;
    }
}

if ($missingFiles === 0) {
    echo "\n✅ All test files are present!\n";
} else {
    echo "\n❌ {$missingFiles} test files are missing\n";
}

// Check model files
$modelFiles = [
    'app/Models/User.php',
    'app/Models/Course.php',
    'app/Models/Lesson.php',
    'app/Models/Module.php',
    'app/Models/Payment.php',
    'app/Models/Certificate.php',
    'app/Models/CourseEnrollment.php',
    'app/Models/UserProgress.php'
];

echo "\nModel Files Status:\n";
echo str_repeat("-", 40) . "\n";

$missingModels = 0;
foreach ($modelFiles as $file) {
    if (file_exists($file)) {
        echo "✅ {$file}\n";
    } else {
        echo "❌ {$file}\n";
        $missingModels++;
    }
}

// Check controller files
$controllerFiles = [
    'app/Http/Controllers/Api/AuthController.php',
    'app/Http/Controllers/Api/CourseController.php',
    'app/Http/Controllers/Api/LessonController.php',
    'app/Http/Controllers/Api/ProgressController.php',
    'app/Http/Controllers/Api/PaymentController.php',
    'app/Http/Controllers/Api/ProfileController.php',
    'app/Http/Controllers/Api/CertificateController.php',
    'app/Http/Controllers/Api/SettingsController.php'
];

echo "\nController Files Status:\n";
echo str_repeat("-", 40) . "\n";

$missingControllers = 0;
foreach ($controllerFiles as $file) {
    if (file_exists($file)) {
        echo "✅ {$file}\n";
    } else {
        echo "❌ {$file}\n";
        $missingControllers++;
    }
}

// Check PHPUnit configuration
if (file_exists('phpunit.xml')) {
    echo "\n✅ phpunit.xml configuration file exists\n";
} else {
    echo "\n❌ phpunit.xml configuration file missing\n";
}

// Summary
echo "\n" . str_repeat("=", 50) . "\n";
echo "VALIDATION SUMMARY\n";
echo str_repeat("=", 50) . "\n";

$allGood = $missingFiles === 0 && $missingModels === 0 && $missingControllers === 0;

if ($allGood) {
    echo "🎉 All systems ready! You can run the tests.\n\n";
    echo "To run tests:\n";
    echo "  • PowerShell: .\\run-tests.ps1\n";
    echo "  • Command line: php artisan test\n";
    echo "  • Specific test: php artisan test tests/Feature/Api/ComprehensiveApiTest.php\n";
} else {
    echo "⚠️  Some components are missing.\n\n";
    
    if ($missingModels > 0) {
        echo "Missing Models: {$missingModels}\n";
    }
    if ($missingControllers > 0) {
        echo "Missing Controllers: {$missingControllers}\n";
    }
    if ($missingFiles > 0) {
        echo "Missing Test Files: {$missingFiles}\n";
    }
    
    echo "\nPlease ensure all required files are in place before running tests.\n";
}

echo "\nFor detailed information, see TEST-DOCUMENTATION.md\n";
echo str_repeat("=", 50) . "\n";
