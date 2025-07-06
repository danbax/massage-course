<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use App\Models\User;
use App\Models\CourseEnrollment;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CourseControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_guest_can_view_published_courses()
    {
        Course::factory()->count(5)->published()->create();
        Course::factory()->count(3)->create(['is_published' => false]);

        $response = $this->getJson('/api/courses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'description',
                        'short_description',
                        'price',
                        'currency',
                        'duration_hours',
                        'difficulty_level',
                        'thumbnail_url',
                        'instructor',
                        'rating_average',
                        'rating_count',
                        'enrollment_count',
                        'is_published',
                        'featured'
                    ]
                ],
                'meta' => [
                    'current_page',
                    'per_page',
                    'total'
                ]
            ])
            ->assertJsonCount(5, 'data');
    }

    public function test_guest_can_view_featured_courses()
    {
        Course::factory()->count(3)->featured()->create();
        Course::factory()->count(5)->published()->create();

        $response = $this->getJson('/api/courses/featured');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'featured'
                    ]
                ]
            ]);

        // Assert all returned courses are featured
        $courses = $response->json('data');
        foreach ($courses as $course) {
            $this->assertTrue($course['featured']);
        }
    }

    public function test_guest_can_search_courses()
    {
        Course::factory()->create([
            'title' => 'Swedish Massage Fundamentals',
            'is_published' => true
        ]);
        Course::factory()->create([
            'title' => 'Deep Tissue Massage',
            'is_published' => true
        ]);
        Course::factory()->create([
            'title' => 'Yoga for Beginners',
            'is_published' => true
        ]);

        $response = $this->getJson('/api/courses/search?q=massage');

        $response->assertStatus(200);
        
        $courses = $response->json('data');
        $this->assertCount(2, $courses);
        
        foreach ($courses as $course) {
            $this->assertStringContainsStringIgnoringCase('massage', $course['title']);
        }
    }

    public function test_guest_can_view_single_course()
    {
        $course = Course::factory()->published()->create();

        $response = $this->getJson("/api/courses/{$course->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'title',
                'description',
                'instructor',
                'modules' => [
                    '*' => [
                        'id',
                        'title',
                        'description',
                        'order',
                        'lessons' => [
                            '*' => [
                                'id',
                                'title',
                                'description',
                                'order',
                                'is_free'
                            ]
                        ]
                    ]
                ]
            ])
            ->assertJson([
                'id' => $course->id,
                'title' => $course->title
            ]);
    }

    public function test_guest_cannot_view_unpublished_course()
    {
        $course = Course::factory()->create(['is_published' => false]);

        $response = $this->getJson("/api/courses/{$course->id}");

        $response->assertStatus(404);
    }

    public function test_authenticated_user_can_view_enrolled_courses()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $enrolledCourses = Course::factory()->count(3)->published()->create();
        $notEnrolledCourse = Course::factory()->published()->create();

        foreach ($enrolledCourses as $course) {
            CourseEnrollment::factory()->create([
                'user_id' => $user->id,
                'course_id' => $course->id
            ]);
        }

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/courses/enrolled');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'progress_percentage',
                        'last_accessed_at',
                        'enrollment_date'
                    ]
                ]
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_authenticated_user_can_enroll_in_course()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $course = Course::factory()->published()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/courses/{$course->id}/enroll", [
            'payment_method' => 'stripe',
            'payment_token' => 'tok_visa'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'enrollment' => [
                    'id',
                    'user_id',
                    'course_id',
                    'enrolled_at'
                ]
            ]);

        $this->assertDatabaseHas('course_enrollments', [
            'user_id' => $user->id,
            'course_id' => $course->id
        ]);
    }

    public function test_user_cannot_enroll_in_same_course_twice()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $course = Course::factory()->published()->create();

        // First enrollment
        CourseEnrollment::factory()->create([
            'user_id' => $user->id,
            'course_id' => $course->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson("/api/courses/{$course->id}/enroll", [
            'payment_method' => 'stripe',
            'payment_token' => 'tok_visa'
        ]);

        $response->assertStatus(409)
            ->assertJson([
                'message' => 'Already enrolled in this course'
            ]);
    }

    public function test_authenticated_user_can_view_course_statistics()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $course = Course::factory()->published()->create();

        CourseEnrollment::factory()->create([
            'user_id' => $user->id,
            'course_id' => $course->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/courses/{$course->id}/statistics");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_lessons',
                'completed_lessons',
                'progress_percentage',
                'time_spent',
                'last_accessed',
                'completion_rate',
                'quiz_scores'
            ]);
    }

    public function test_user_cannot_view_statistics_for_non_enrolled_course()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $course = Course::factory()->published()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/courses/{$course->id}/statistics");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Not enrolled in this course'
            ]);
    }

    public function test_course_filters_work_correctly()
    {
        Course::factory()->create([
            'difficulty_level' => 'beginner',
            'category' => 'swedish',
            'is_published' => true
        ]);
        Course::factory()->create([
            'difficulty_level' => 'advanced',
            'category' => 'deep-tissue',
            'is_published' => true
        ]);

        $response = $this->getJson('/api/courses?difficulty=beginner&category=swedish');

        $response->assertStatus(200);
        
        $courses = $response->json('data');
        foreach ($courses as $course) {
            $this->assertEquals('beginner', $course['difficulty_level']);
            $this->assertEquals('swedish', $course['category']);
        }
    }

    public function test_course_sorting_works_correctly()
    {
        Course::factory()->create([
            'title' => 'A Course',
            'price' => 100,
            'created_at' => now()->subDays(5),
            'is_published' => true
        ]);
        Course::factory()->create([
            'title' => 'B Course',
            'price' => 50,
            'created_at' => now()->subDays(1),
            'is_published' => true
        ]);

        // Test price ascending
        $response = $this->getJson('/api/courses?sort=price&order=asc');
        $response->assertStatus(200);
        $courses = $response->json('data');
        $this->assertLessThanOrEqual($courses[1]['price'], $courses[0]['price']);

        // Test newest first
        $response = $this->getJson('/api/courses?sort=created_at&order=desc');
        $response->assertStatus(200);
        $courses = $response->json('data');
        $this->assertGreaterThanOrEqual($courses[1]['created_at'], $courses[0]['created_at']);
    }
}
