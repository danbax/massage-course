# Massage Course API - Test Documentation

## Overview
This Laravel backend has comprehensive tests covering all API routes. The test suite includes:

- **Authentication Routes**: Registration, login, logout, password reset
- **Course Routes**: Public course listings, enrollment, statistics
- **Lesson Routes**: Lesson access, progress tracking, completion
- **Progress Routes**: User progress analytics and tracking
- **Payment Routes**: Payment processing, history, webhooks
- **Profile Routes**: User profile management
- **Certificate Routes**: Certificate generation and verification
- **Settings Routes**: User settings and notifications
- **General API Routes**: Health checks, error handling, CORS

## Test Files Created

### Main Test Files
1. `tests/Feature/Api/AuthControllerTest.php` - Authentication tests
2. `tests/Feature/Api/CourseControllerTest.php` - Course management tests
3. `tests/Feature/Api/LessonControllerTest.php` - Lesson interaction tests
4. `tests/Feature/Api/ProgressControllerTest.php` - Progress tracking tests
5. `tests/Feature/Api/PaymentControllerTest.php` - Payment processing tests
6. `tests/Feature/Api/PaymentControllerTestFixed.php` - Updated payment tests
7. `tests/Feature/Api/ProfileControllerTest.php` - Profile management tests
8. `tests/Feature/Api/CertificateControllerTest.php` - Certificate tests
9. `tests/Feature/Api/SettingsControllerTest.php` - Settings tests
10. `tests/Feature/Api/GeneralApiTest.php` - General API tests
11. `tests/Feature/Api/ComprehensiveApiTest.php` - All-in-one test suite

### Test Runners
- `run-tests.ps1` - PowerShell script for Windows
- `run-comprehensive-tests.php` - PHP-based test runner

## API Routes Covered

### Public Routes (No Authentication Required)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET /api/courses
GET /api/courses/featured
GET /api/courses/search
GET /api/courses/{id}
GET /api/certificates/verify/{code}
GET /api/health
POST /api/webhooks/stripe
```

### Protected Routes (Authentication Required)
```
POST /api/auth/logout
GET /api/auth/user
POST /api/auth/refresh

GET /api/profile
PUT /api/profile
POST /api/profile/avatar
DELETE /api/profile/avatar
PUT /api/profile/password

GET /api/courses/enrolled
POST /api/courses/{id}/enroll
GET /api/courses/{id}/statistics

GET /api/lessons/{id}
PUT /api/lessons/{id}/progress
POST /api/lessons/{id}/complete
POST /api/lessons/{id}/quiz
GET /api/lessons/{id}/notes
PUT /api/lessons/{id}/notes

GET /api/progress
GET /api/progress/analytics
GET /api/progress/course/{id}
GET /api/progress/lesson/{id}

GET /api/certificates
GET /api/certificates/{id}
GET /api/certificates/{id}/download
POST /api/certificates/generate/{id}

GET /api/payments
POST /api/payments/intent
POST /api/payments/confirm
GET /api/payments/{id}

GET /api/settings
PUT /api/settings
GET /api/settings/notifications
PUT /api/settings/notifications
```

## How to Run Tests

### Prerequisites
1. Ensure PHP is installed and accessible from command line
2. Ensure Composer dependencies are installed: `composer install`
3. Set up `.env` file with database configuration
4. Run migrations: `php artisan migrate:fresh --seed`

### Running Individual Test Files
```bash
# Run authentication tests
php artisan test tests/Feature/Api/AuthControllerTest.php

# Run course tests
php artisan test tests/Feature/Api/CourseControllerTest.php

# Run comprehensive tests
php artisan test tests/Feature/Api/ComprehensiveApiTest.php
```

### Running All Tests
```bash
# Run all feature tests
php artisan test tests/Feature/

# Run with verbose output
php artisan test tests/Feature/ --verbose

# Run with test coverage
php artisan test tests/Feature/ --coverage
```

### Using PowerShell Script (Windows)
```powershell
# Navigate to project directory
cd "c:\path\to\massage-course-backend"

# Run the PowerShell test script
.\run-tests.ps1
```

## Test Structure

### Sample Test Method
```php
public function test_user_can_register_successfully()
{
    $userData = [
        'name' => $this->faker->name,
        'email' => $this->faker->unique()->safeEmail,
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->postJson('/api/auth/register', $userData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'user' => [
                'id',
                'name',
                'email',
                'created_at',
                'updated_at'
            ]
        ]);

    $this->assertDatabaseHas('users', [
        'email' => $userData['email'],
        'name' => $userData['name']
    ]);
}
```

## What Each Test Validates

### Authentication Tests
- User registration with valid data
- Registration validation (duplicate emails, invalid passwords)
- User login with valid/invalid credentials
- Password reset functionality
- Protected route access control

### Course Tests
- Public course listing and search
- Single course retrieval
- Course enrollment process
- Enrolled courses for authenticated users
- Course statistics and progress

### Lesson Tests
- Lesson access for enrolled users
- Progress tracking and updates
- Lesson completion marking
- Quiz submission
- Note-taking functionality

### Payment Tests
- Payment history retrieval
- Payment intent creation
- Payment confirmation
- Stripe webhook handling
- Payment validation and errors

### Profile Tests
- Profile information retrieval
- Profile updates
- Avatar upload/deletion
- Password changes

### Certificate Tests
- Certificate generation
- Certificate retrieval
- Download functionality
- Public verification

### Progress Tests
- Progress analytics
- Course-specific progress
- Lesson-specific progress
- Overall progress tracking

### Settings Tests
- User settings management
- Notification preferences
- Settings updates

## Expected Test Results

When all tests pass, you should see:
- ✅ All authentication flows working
- ✅ Course management functioning
- ✅ Payment processing operational
- ✅ User profiles manageable
- ✅ Progress tracking accurate
- ✅ Certificates generating properly
- ✅ API security measures active

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure `.env` has correct database settings
2. **Missing Dependencies**: Run `composer install`
3. **Migration Issues**: Run `php artisan migrate:fresh --seed`
4. **Sanctum Issues**: Check Laravel Sanctum installation
5. **Permission Issues**: Ensure proper file permissions

### Sanctum Configuration
If Sanctum token tests fail, ensure:
1. Sanctum is installed: `composer require laravel/sanctum`
2. Sanctum is published: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
3. User model has `HasApiTokens` trait
4. Sanctum middleware is configured in `app/Http/Kernel.php`

## Test Coverage Summary

- **Total API Endpoints**: ~35 routes
- **Test Files**: 11 comprehensive test files
- **Test Methods**: 100+ individual tests
- **Coverage Areas**: Authentication, CRUD operations, Business logic, Error handling, Validation, Security

All routes in your `routes/api.php` file have corresponding tests to ensure they work correctly under various conditions including success cases, error cases, validation failures, and security scenarios.
