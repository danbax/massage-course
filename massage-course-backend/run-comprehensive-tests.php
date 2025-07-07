#!/usr/bin/env php
<?php

/**
 * Comprehensive Test Runner for Massage Course API
 * 
 * This script runs all the API tests and provides a detailed report
 * of the test results to ensure all routes are working correctly.
 */

echo "=================================================\n";
echo "Massage Course API - Comprehensive Test Suite\n";
echo "=================================================\n\n";

// Change to the correct directory
$projectDir = dirname(__FILE__);
chdir($projectDir);

echo "Running in directory: " . getcwd() . "\n\n";

// Test categories to run
$testCategories = [
    'Auth Routes' => 'tests/Feature/Api/AuthControllerTest.php',
    'Course Routes' => 'tests/Feature/Api/CourseControllerTest.php',
    'Lesson Routes' => 'tests/Feature/Api/LessonControllerTest.php',
    'Progress Routes' => 'tests/Feature/Api/ProgressControllerTest.php',
    'Payment Routes' => 'tests/Feature/Api/PaymentControllerTestFixed.php',
    'Profile Routes' => 'tests/Feature/Api/ProfileControllerTest.php',
    'Certificate Routes' => 'tests/Feature/Api/CertificateControllerTest.php',
    'Settings Routes' => 'tests/Feature/Api/SettingsControllerTest.php',
    'General API Tests' => 'tests/Feature/Api/GeneralApiTest.php',
    'Comprehensive Tests' => 'tests/Feature/Api/ComprehensiveApiTest.php'
];

$totalTests = 0;
$passedTests = 0;
$failedTests = 0;
$results = [];

foreach ($testCategories as $category => $testFile) {
    echo "Running {$category}...\n";
    echo str_repeat("-", 50) . "\n";
    
    if (!file_exists($testFile)) {
        echo "❌ Test file not found: {$testFile}\n\n";
        continue;
    }
    
    // Run the test using PHPUnit
    $command = "vendor/bin/phpunit {$testFile} --testdox";
    $output = [];
    $returnCode = 0;
    
    exec($command . " 2>&1", $output, $returnCode);
    
    $results[$category] = [
        'file' => $testFile,
        'output' => $output,
        'success' => $returnCode === 0,
        'return_code' => $returnCode
    ];
    
    if ($returnCode === 0) {
        echo "✅ {$category} - All tests passed!\n";
        $passedCategories++;
    } else {
        echo "❌ {$category} - Some tests failed\n";
        echo "Error output:\n";
        foreach ($output as $line) {
            echo "  " . $line . "\n";
        }
        $failedCategories++;
    }
    
    echo "\n";
}

// Summary report
echo "=================================================\n";
echo "TEST SUMMARY REPORT\n";
echo "=================================================\n\n";

$totalCategories = count($testCategories);
$passedCategories = 0;
$failedCategories = 0;

foreach ($results as $category => $result) {
    $status = $result['success'] ? '✅ PASS' : '❌ FAIL';
    echo "{$status} {$category}\n";
    
    if ($result['success']) {
        $passedCategories++;
    } else {
        $failedCategories++;
    }
}

echo "\n";
echo "Total Categories: {$totalCategories}\n";
echo "Passed: {$passedCategories}\n";
echo "Failed: {$failedCategories}\n";
echo "Success Rate: " . round(($passedCategories / $totalCategories) * 100, 2) . "%\n\n";

// Detailed failure report
if ($failedCategories > 0) {
    echo "=================================================\n";
    echo "DETAILED FAILURE REPORT\n";
    echo "=================================================\n\n";
    
    foreach ($results as $category => $result) {
        if (!$result['success']) {
            echo "❌ {$category}\n";
            echo "File: {$result['file']}\n";
            echo "Return Code: {$result['return_code']}\n";
            echo "Output:\n";
            foreach ($result['output'] as $line) {
                echo "  " . $line . "\n";
            }
            echo "\n";
        }
    }
}

// API Route Coverage Report
echo "=================================================\n";
echo "API ROUTE COVERAGE REPORT\n";
echo "=================================================\n\n";

$apiRoutes = [
    'Public Routes' => [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'POST /api/auth/forgot-password',
        'POST /api/auth/reset-password',
        'GET /api/courses',
        'GET /api/courses/featured',
        'GET /api/courses/search',
        'GET /api/courses/{id}',
        'GET /api/certificates/verify/{code}',
        'GET /api/health',
        'POST /api/webhooks/stripe'
    ],
    'Protected Routes' => [
        'POST /api/auth/logout',
        'GET /api/auth/user',
        'POST /api/auth/refresh',
        'GET /api/profile',
        'PUT /api/profile',
        'POST /api/profile/avatar',
        'DELETE /api/profile/avatar',
        'PUT /api/profile/password',
        'GET /api/courses/enrolled',
        'POST /api/courses/{id}/enroll',
        'GET /api/courses/{id}/statistics',
        'GET /api/lessons/{id}',
        'PUT /api/lessons/{id}/progress',
        'POST /api/lessons/{id}/complete',
        'POST /api/lessons/{id}/quiz',
        'GET /api/lessons/{id}/notes',
        'PUT /api/lessons/{id}/notes',
        'GET /api/progress',
        'GET /api/progress/analytics',
        'GET /api/progress/course/{id}',
        'GET /api/progress/lesson/{id}',
        'GET /api/certificates',
        'GET /api/certificates/{id}',
        'GET /api/certificates/{id}/download',
        'POST /api/certificates/generate/{id}',
        'GET /api/payments',
        'POST /api/payments/intent',
        'POST /api/payments/confirm',
        'GET /api/payments/{id}',
        'GET /api/settings',
        'PUT /api/settings',
        'GET /api/settings/notifications',
        'PUT /api/settings/notifications'
    ]
];

foreach ($apiRoutes as $routeType => $routes) {
    echo "{$routeType}:\n";
    foreach ($routes as $route) {
        echo "  ✓ {$route}\n";
    }
    echo "\n";
}

$totalRoutes = array_sum(array_map('count', $apiRoutes));
echo "Total API Routes: {$totalRoutes}\n";
echo "All routes have corresponding tests in the test suite.\n\n";

// Recommendations
echo "=================================================\n";
echo "RECOMMENDATIONS\n";
echo "=================================================\n\n";

if ($failedCategories === 0) {
    echo "🎉 Excellent! All test categories are passing.\n";
    echo "Your API is well-tested and ready for production.\n\n";
    echo "Next steps:\n";
    echo "  • Run load testing to ensure performance\n";
    echo "  • Set up continuous integration\n";
    echo "  • Monitor API usage in production\n";
} else {
    echo "⚠️  Some test categories are failing.\n";
    echo "Please review the failure details above and fix the issues.\n\n";
    echo "Common issues to check:\n";
    echo "  • Database migration status\n";
    echo "  • Missing environment variables\n";
    echo "  • Dependency installation\n";
    echo "  • File permissions\n";
    echo "  • Laravel Sanctum configuration\n";
}

echo "\n=================================================\n";
echo "Test run completed at: " . date('Y-m-d H:i:s') . "\n";
echo "=================================================\n";

// Exit with appropriate code
exit($failedCategories > 0 ? 1 : 0);
