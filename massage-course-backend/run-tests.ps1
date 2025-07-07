# Massage Course API Test Runner
# PowerShell script to run comprehensive tests

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Massage Course API - Comprehensive Test Suite" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "artisan")) {
    Write-Host "Error: Please run this script from the Laravel project root directory" -ForegroundColor Red
    exit 1
}

# Check if vendor directory exists
if (-not (Test-Path "vendor")) {
    Write-Host "Installing Composer dependencies..." -ForegroundColor Yellow
    composer install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Composer dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    php artisan key:generate
}

# Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
php artisan migrate:fresh --seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Database migration failed, continuing with tests..." -ForegroundColor Yellow
}

# Test categories
$testFiles = @(
    @{ Name = "Auth Controller"; File = "tests\Feature\Api\AuthControllerTest.php" },
    @{ Name = "Course Controller"; File = "tests\Feature\Api\CourseControllerTest.php" },
    @{ Name = "Lesson Controller"; File = "tests\Feature\Api\LessonControllerTest.php" },
    @{ Name = "Progress Controller"; File = "tests\Feature\Api\ProgressControllerTest.php" },
    @{ Name = "Payment Controller"; File = "tests\Feature\Api\PaymentControllerTestFixed.php" },
    @{ Name = "Profile Controller"; File = "tests\Feature\Api\ProfileControllerTest.php" },
    @{ Name = "Certificate Controller"; File = "tests\Feature\Api\CertificateControllerTest.php" },
    @{ Name = "Settings Controller"; File = "tests\Feature\Api\SettingsControllerTest.php" },
    @{ Name = "General API"; File = "tests\Feature\Api\GeneralApiTest.php" },
    @{ Name = "Comprehensive API"; File = "tests\Feature\Api\ComprehensiveApiTest.php" }
)

$totalTests = $testFiles.Count
$passedTests = 0
$failedTests = 0

foreach ($test in $testFiles) {
    Write-Host "Running $($test.Name) tests..." -ForegroundColor White
    Write-Host ("-" * 50) -ForegroundColor Gray
    
    if (-not (Test-Path $test.File)) {
        Write-Host "❌ Test file not found: $($test.File)" -ForegroundColor Red
        $failedTests++
        continue
    }
    
    # Run the test
    php artisan test $test.File --verbose
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $($test.Name) - All tests passed!" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "❌ $($test.Name) - Some tests failed" -ForegroundColor Red
        $failedTests++
    }
    
    Write-Host ""
}

# Summary
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Test Suites: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red

$successRate = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 2) } else { 0 }
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -eq 100) { "Green" } else { "Yellow" })

Write-Host ""

if ($failedTests -eq 0) {
    Write-Host "🎉 All tests passed! Your API is working correctly." -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Please check the output above for details." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor White
    Write-Host "• Ensure Laravel Sanctum is properly installed" -ForegroundColor Gray
    Write-Host "• Check database configuration" -ForegroundColor Gray
    Write-Host "• Verify all models and controllers exist" -ForegroundColor Gray
    Write-Host "• Make sure all required packages are installed" -ForegroundColor Gray
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Test run completed at: $(Get-Date)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Keep the window open
Read-Host "Press Enter to exit..."
