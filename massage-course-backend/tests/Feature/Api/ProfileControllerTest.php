<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'bio' => 'Massage therapy enthusiast',
            'profession' => 'Massage Therapist',
            'experience_level' => 'intermediate'
        ]);
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_user_can_view_profile()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'avatar',
                'phone',
                'date_of_birth',
                'profession',
                'bio',
                'role',
                'timezone',
                'language',
                'country',
                'city',
                'experience_level',
                'marketing_consent',
                'newsletter_subscription',
                'notification_preferences',
                'last_login_at',
                'created_at',
                'updated_at'
            ])
            ->assertJson([
                'id' => $this->user->id,
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '+1234567890',
                'bio' => 'Massage therapy enthusiast',
                'profession' => 'Massage Therapist',
                'experience_level' => 'intermediate'
            ]);
    }

    public function test_user_can_update_profile()
    {
        $updateData = [
            'name' => 'John Smith',
            'phone' => '+1987654321',
            'bio' => 'Professional massage therapist with 10 years experience',
            'profession' => 'Licensed Massage Therapist',
            'timezone' => 'America/Los_Angeles',
            'language' => 'en',
            'country' => 'United States',
            'city' => 'Los Angeles',
            'experience_level' => 'professional',
            'marketing_consent' => true,
            'newsletter_subscription' => false
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/profile', $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'name',
                    'phone',
                    'bio',
                    'profession',
                    'experience_level',
                    'updated_at'
                ]
            ])
            ->assertJson([
                'message' => 'Profile updated successfully',
                'user' => [
                    'name' => 'John Smith',
                    'phone' => '+1987654321',
                    'bio' => 'Professional massage therapist with 10 years experience',
                    'profession' => 'Licensed Massage Therapist',
                    'experience_level' => 'professional'
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'John Smith',
            'phone' => '+1987654321',
            'bio' => 'Professional massage therapist with 10 years experience'
        ]);
    }

    public function test_user_cannot_update_email_through_profile()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/profile', [
            'email' => 'newemail@example.com'
        ]);

        $response->assertStatus(200);
        
        // Email should not be updated
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'email' => 'john@example.com' // Original email
        ]);
    }

    public function test_profile_update_validation()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/profile', [
            'name' => '', // Required field
            'experience_level' => 'invalid_level', // Invalid enum value
            'phone' => 'invalid-phone' // Invalid format
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'experience_level', 'phone']);
    }

    public function test_user_can_upload_avatar()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg', 500, 500);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/profile/avatar', [
            'avatar' => $file
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'avatar_url'
            ]);

        $avatarUrl = $response->json('avatar_url');
        $this->assertNotNull($avatarUrl);

        // Check file was stored
        $filename = basename($avatarUrl);
        $this->assertTrue(Storage::disk('public')->exists("avatars/{$filename}"));

        // Check database was updated
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'avatar' => $avatarUrl
        ]);
    }

    public function test_avatar_upload_validation()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/profile/avatar', [
            'avatar' => 'not-a-file'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['avatar']);

        // Test file too large
        $largeFile = UploadedFile::fake()->create('large.jpg', 3000); // 3MB

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/profile/avatar', [
            'avatar' => $largeFile
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['avatar']);
    }

    public function test_user_can_delete_avatar()
    {
        Storage::fake('public');
        
        // Set an avatar first
        $this->user->update(['avatar' => 'avatars/test-avatar.jpg']);
        Storage::disk('public')->put('avatars/test-avatar.jpg', 'fake-image-content');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->deleteJson('/api/profile/avatar');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Avatar deleted successfully'
            ]);

        // Check file was deleted
        $this->assertFalse(Storage::disk('public')->exists('avatars/test-avatar.jpg'));

        // Check database was updated
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'avatar' => null
        ]);
    }

    public function test_user_can_update_password()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/profile/password', [
            'current_password' => 'password',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password updated successfully'
            ]);

        // Verify password was changed
        $this->user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $this->user->getAuthPassword()));
    }

    public function test_password_update_requires_correct_current_password()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/profile/password', [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_password_update_validation()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/profile/password', [
            'current_password' => 'password',
            'password' => '123', // Too short
            'password_confirmation' => '456' // Doesn't match
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_notification_preferences_update()
    {
        $preferences = [
            'email_course_updates' => true,
            'email_new_courses' => false,
            'email_certificates' => true,
            'push_lesson_reminders' => false,
            'sms_important_updates' => true
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson('/api/profile', [
            'notification_preferences' => $preferences
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'notification_preferences' => json_encode($preferences)
        ]);
    }

    public function test_unauthenticated_user_cannot_access_profile_endpoints()
    {
        $endpoints = [
            'GET /api/profile',
            'PUT /api/profile',
            'POST /api/profile/avatar',
            'DELETE /api/profile/avatar',
            'PUT /api/profile/password'
        ];

        foreach ($endpoints as $endpoint) {
            [$method, $url] = explode(' ', $endpoint);
            $response = $this->json($method, $url);
            $response->assertStatus(401);
        }
    }

    public function test_profile_includes_enrollment_statistics()
    {
        // Create some enrollments and progress
        $courses = \App\Models\Course::factory()->count(3)->published()->create();
        foreach ($courses as $course) {
            \App\Models\CourseEnrollment::factory()->create([
                'user_id' => $this->user->id,
                'course_id' => $course->id
            ]);
        }

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'statistics' => [
                    'courses_enrolled',
                    'courses_completed',
                    'certificates_earned',
                    'total_learning_time',
                    'current_streak',
                    'join_date'
                ]
            ]);
    }
}
