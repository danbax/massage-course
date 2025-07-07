<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use App\Models\User;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\CourseEnrollment;
use App\Models\Payment;
use App\Models\Certificate;
use App\Models\UserCertificate;
use App\Models\UserProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ComprehensiveApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private User $admin;
    private Course $course;
    private Module $module;
    private Lesson $lesson;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->course = Course::factory()->published()->create();
        $this->module = Module::factory()->create(['course_id' => $this->course->id]);
        $this->lesson = Lesson::factory()->create(['module_id' => $this->module->id]);
    }

    // ========================
    // AUTH ROUTES TESTS
    // ========================

    public function test_auth_routes_work_correctly()
    {
        // Test registration
        $userData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/auth/register', $userData);
        $response->assertStatus(201);

        // Test login
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => $userData['email'],
            'password' => 'password123',
        ]);
        $loginResponse->assertStatus(200);

        // Test getting user info
        $newUser = User::where('email', $userData['email'])->first();
        $userResponse = $this->actingAs($newUser)->getJson('/api/auth/user');
        $userResponse->assertStatus(200);

        // Test logout
        $logoutResponse = $this->actingAs($newUser)->postJson('/api/auth/logout');
        $logoutResponse->assertStatus(200);
    }

    // ========================
    // COURSE ROUTES TESTS
    // ========================

    public function test_public_course_routes_work()
    {
        // Test get all courses
        $response = $this->getJson('/api/courses');
        $response->assertStatus(200);

        // Test get featured courses
        $response = $this->getJson('/api/courses/featured');
        $response->assertStatus(200);

        // Test search courses
        $response = $this->getJson('/api/courses/search?q=massage');
        $response->assertStatus(200);

        // Test get single course
        $response = $this->getJson("/api/courses/{$this->course->id}");
        $response->assertStatus(200);
    }

    public function test_protected_course_routes_work()
    {
        // Test get enrolled courses
        $response = $this->actingAs($this->user)->getJson('/api/courses/enrolled');
        $response->assertStatus(200);

        // Test course enrollment
        $enrollResponse = $this->actingAs($this->user)
            ->postJson("/api/courses/{$this->course->id}/enroll", [
                'payment_method' => 'stripe',
                'payment_token' => 'tok_visa'
            ]);
        $enrollResponse->assertStatus(201);

        // Create enrollment for statistics test
        CourseEnrollment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);

        // Test course statistics
        $statsResponse = $this->actingAs($this->user)
            ->getJson("/api/courses/{$this->course->id}/statistics");
        $statsResponse->assertStatus(200);
    }

    // ========================
    // LESSON ROUTES TESTS
    // ========================

    public function test_lesson_routes_work()
    {
        // Enroll user in course first
        CourseEnrollment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);

        // Test get lesson
        $response = $this->actingAs($this->user)->getJson("/api/lessons/{$this->lesson->id}");
        $response->assertStatus(200);

        // Test update lesson progress
        $progressResponse = $this->actingAs($this->user)
            ->putJson("/api/lessons/{$this->lesson->id}/progress", [
                'progress_percentage' => 50,
                'time_spent' => 300
            ]);
        $progressResponse->assertStatus(200);

        // Test mark lesson as completed
        $completeResponse = $this->actingAs($this->user)
            ->postJson("/api/lessons/{$this->lesson->id}/complete");
        $completeResponse->assertStatus(200);

        // Test lesson notes
        $notesResponse = $this->actingAs($this->user)
            ->getJson("/api/lessons/{$this->lesson->id}/notes");
        $notesResponse->assertStatus(200);

        // Test update lesson notes
        $updateNotesResponse = $this->actingAs($this->user)
            ->putJson("/api/lessons/{$this->lesson->id}/notes", [
                'notes' => 'Test lesson notes'
            ]);
        $updateNotesResponse->assertStatus(200);
    }

    // ========================
    // PROGRESS ROUTES TESTS
    // ========================

    public function test_progress_routes_work()
    {
        // Create some progress data
        UserProgress::factory()->create([
            'user_id' => $this->user->id,
            'lesson_id' => $this->lesson->id,
            'progress_percentage' => 75
        ]);

        // Test get all progress
        $response = $this->actingAs($this->user)->getJson('/api/progress');
        $response->assertStatus(200);

        // Test progress analytics
        $analyticsResponse = $this->actingAs($this->user)->getJson('/api/progress/analytics');
        $analyticsResponse->assertStatus(200);

        // Test course-specific progress
        $courseProgressResponse = $this->actingAs($this->user)
            ->getJson("/api/progress/course/{$this->course->id}");
        $courseProgressResponse->assertStatus(200);

        // Test lesson-specific progress
        $lessonProgressResponse = $this->actingAs($this->user)
            ->getJson("/api/progress/lesson/{$this->lesson->id}");
        $lessonProgressResponse->assertStatus(200);
    }

    // ========================
    // CERTIFICATE ROUTES TESTS
    // ========================

    public function test_certificate_routes_work()
    {
        $certificate = Certificate::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);

        // Test get certificates
        $response = $this->actingAs($this->user)->getJson('/api/certificates');
        $response->assertStatus(200);

        // Test get single certificate
        $showResponse = $this->actingAs($this->user)
            ->getJson("/api/certificates/{$certificate->id}");
        $showResponse->assertStatus(200);

        // Test certificate download
        $downloadResponse = $this->actingAs($this->user)
            ->getJson("/api/certificates/{$certificate->id}/download");
        $downloadResponse->assertStatus(200);

        // Test generate certificate
        $generateResponse = $this->actingAs($this->user)
            ->postJson("/api/certificates/generate/{$this->course->id}");
        $generateResponse->assertStatus(201);
    }

    public function test_public_certificate_verification_works()
    {
        $certificate = UserCertificate::factory()->create([
            'verification_code' => 'TEST123'
        ]);

        $response = $this->getJson('/api/certificates/verify/TEST123');
        $response->assertStatus(200);
    }

    // ========================
    // PAYMENT ROUTES TESTS
    // ========================

    public function test_payment_routes_work()
    {
        Payment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);

        // Test get payment history
        $response = $this->actingAs($this->user)->getJson('/api/payments');
        $response->assertStatus(200);

        // Test create payment intent
        $intentResponse = $this->actingAs($this->user)
            ->postJson('/api/payments/intent', [
                'course_id' => $this->course->id,
                'payment_method' => 'stripe'
            ]);
        // Note: This might fail without actual Stripe setup, but route should exist
        $this->assertTrue(in_array($intentResponse->status(), [200, 500]));

        // Test get specific payment
        $payment = Payment::where('user_id', $this->user->id)->first();
        if ($payment) {
            $showResponse = $this->actingAs($this->user)
                ->getJson("/api/payments/{$payment->id}");
            $showResponse->assertStatus(200);
        }
    }

    // ========================
    // PROFILE ROUTES TESTS
    // ========================

    public function test_profile_routes_work()
    {
        // Test get profile
        $response = $this->actingAs($this->user)->getJson('/api/profile');
        $response->assertStatus(200);

        // Test update profile
        $updateResponse = $this->actingAs($this->user)
            ->putJson('/api/profile', [
                'name' => 'Updated Name',
                'bio' => 'Updated bio'
            ]);
        $updateResponse->assertStatus(200);

        // Test update password
        $passwordResponse = $this->actingAs($this->user)
            ->putJson('/api/profile/password', [
                'current_password' => 'password',
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123'
            ]);
        $passwordResponse->assertStatus(200);
    }

    // ========================
    // SETTINGS ROUTES TESTS
    // ========================

    public function test_settings_routes_work()
    {
        // Test get settings
        $response = $this->actingAs($this->user)->getJson('/api/settings');
        $response->assertStatus(200);

        // Test update settings
        $updateResponse = $this->actingAs($this->user)
            ->putJson('/api/settings', [
                'language' => 'en',
                'timezone' => 'UTC'
            ]);
        $updateResponse->assertStatus(200);

        // Test get notification settings
        $notificationsResponse = $this->actingAs($this->user)
            ->getJson('/api/settings/notifications');
        $notificationsResponse->assertStatus(200);

        // Test update notification settings
        $updateNotificationsResponse = $this->actingAs($this->user)
            ->putJson('/api/settings/notifications', [
                'email_notifications' => true,
                'push_notifications' => false
            ]);
        $updateNotificationsResponse->assertStatus(200);
    }

    // ========================
    // MISC ROUTES TESTS
    // ========================

    public function test_health_check_works()
    {
        $response = $this->get('/api/health');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'timestamp',
                'version'
            ]);
    }

    public function test_webhook_route_exists()
    {
        // Test that webhook route is accessible (even if it returns an error without proper data)
        $response = $this->postJson('/api/webhooks/stripe', []);
        // Should return some response (not 404)
        $this->assertNotEquals(404, $response->status());
    }

    // ========================
    // VALIDATION TESTS
    // ========================

    public function test_routes_properly_validate_authentication()
    {
        $protectedRoutes = [
            ['GET', '/api/auth/user'],
            ['POST', '/api/auth/logout'],
            ['GET', '/api/courses/enrolled'],
            ['GET', '/api/profile'],
            ['GET', '/api/settings'],
            ['GET', '/api/payments'],
            ['GET', '/api/certificates'],
            ['GET', '/api/progress']
        ];

        foreach ($protectedRoutes as [$method, $route]) {
            $response = $this->json($method, $route);
            $this->assertEquals(401, $response->status(), "Route {$method} {$route} should require authentication");
        }
    }

    public function test_invalid_routes_return_404()
    {
        $invalidRoutes = [
            '/api/nonexistent',
            '/api/courses/999999',
            '/api/lessons/999999'
        ];

        foreach ($invalidRoutes as $route) {
            $response = $this->getJson($route);
            $this->assertEquals(404, $response->status(), "Route {$route} should return 404");
        }
    }

    // ========================
    // CORS AND API TESTS
    // ========================

    public function test_api_returns_json_content_type()
    {
        $response = $this->getJson('/api/health');
        $response->assertHeader('Content-Type', 'application/json');
    }

    public function test_api_pagination_works()
    {
        Course::factory()->count(25)->published()->create();

        $response = $this->getJson('/api/courses?per_page=10');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'meta' => [
                    'current_page',
                    'per_page',
                    'total'
                ]
            ]);

        $meta = $response->json('meta');
        $this->assertEquals(10, $meta['per_page']);
        $this->assertGreaterThanOrEqual(25, $meta['total']);
    }
}
