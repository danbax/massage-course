<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\User;
use App\Models\CourseEnrollment;
use App\Models\UserProgress;
use App\Models\LessonProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProgressControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private string $token;
    private Course $course;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
        
        $this->course = Course::factory()->published()->create();
        
        // Enroll user in course
        CourseEnrollment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);
    }

    public function test_user_can_view_progress_overview()
    {
        // Create some progress data
        UserProgress::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'progress_percentage' => 65.5
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/progress');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'overall_progress' => [
                    'total_courses',
                    'completed_courses',
                    'in_progress_courses',
                    'average_progress',
                    'total_time_spent',
                    'certificates_earned'
                ],
                'recent_activity' => [
                    '*' => [
                        'course_id',
                        'course_title',
                        'lesson_id',
                        'lesson_title',
                        'action',
                        'timestamp'
                    ]
                ],
                'courses' => [
                    '*' => [
                        'course_id',
                        'course_title',
                        'progress_percentage',
                        'last_accessed',
                        'time_spent',
                        'status'
                    ]
                ]
            ]);
    }

    public function test_user_can_view_analytics()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/progress/analytics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'learning_streak' => [
                    'current_streak',
                    'longest_streak',
                    'last_activity_date'
                ],
                'time_analytics' => [
                    'daily_average',
                    'weekly_total',
                    'monthly_total',
                    'preferred_learning_time'
                ],
                'performance_metrics' => [
                    'quiz_average',
                    'completion_rate',
                    'engagement_score'
                ],
                'weekly_activity' => [
                    '*' => [
                        'date',
                        'minutes_spent',
                        'lessons_completed'
                    ]
                ],
                'category_breakdown' => [
                    '*' => [
                        'category',
                        'courses_enrolled',
                        'progress_percentage',
                        'time_spent'
                    ]
                ]
            ]);
    }

    public function test_user_can_view_course_specific_progress()
    {
        $module = Module::factory()->create(['course_id' => $this->course->id]);
        $lesson = Lesson::factory()->create(['module_id' => $module->id]);
        
        LessonProgress::factory()->create([
            'user_id' => $this->user->id,
            'lesson_id' => $lesson->id,
            'is_completed' => true,
            'progress_percentage' => 100
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/progress/course/{$this->course->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'course' => [
                    'id',
                    'title',
                    'total_lessons',
                    'completed_lessons',
                    'progress_percentage',
                    'time_spent',
                    'estimated_completion'
                ],
                'modules' => [
                    '*' => [
                        'id',
                        'title',
                        'total_lessons',
                        'completed_lessons',
                        'progress_percentage',
                        'lessons' => [
                            '*' => [
                                'id',
                                'title',
                                'is_completed',
                                'progress_percentage',
                                'time_spent'
                            ]
                        ]
                    ]
                ],
                'milestones' => [
                    '*' => [
                        'percentage',
                        'title',
                        'is_achieved',
                        'achieved_at'
                    ]
                ],
                'quiz_results' => [
                    '*' => [
                        'lesson_id',
                        'lesson_title',
                        'score',
                        'attempts',
                        'best_score'
                    ]
                ]
            ]);
    }

    public function test_user_cannot_view_progress_for_non_enrolled_course()
    {
        $otherCourse = Course::factory()->published()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/progress/course/{$otherCourse->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Not enrolled in this course'
            ]);
    }

    public function test_user_can_view_lesson_specific_progress()
    {
        $module = Module::factory()->create(['course_id' => $this->course->id]);
        $lesson = Lesson::factory()->create(['module_id' => $module->id]);
        
        $lessonProgress = LessonProgress::factory()->create([
            'user_id' => $this->user->id,
            'lesson_id' => $lesson->id,
            'progress_percentage' => 75,
            'time_spent' => 45,
            'notes' => 'Great lesson on massage techniques'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/progress/lesson/{$lesson->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'lesson' => [
                    'id',
                    'title',
                    'estimated_duration'
                ],
                'progress' => [
                    'progress_percentage',
                    'time_spent',
                    'is_completed',
                    'started_at',
                    'completed_at',
                    'last_accessed_at'
                ],
                'notes' => [
                    'content',
                    'updated_at'
                ],
                'quiz_attempts' => [
                    '*' => [
                        'attempt_number',
                        'score',
                        'percentage',
                        'completed_at'
                    ]
                ],
                'session_history' => [
                    '*' => [
                        'date',
                        'time_spent',
                        'progress_gained'
                    ]
                ]
            ])
            ->assertJson([
                'progress' => [
                    'progress_percentage' => 75,
                    'time_spent' => 45
                ],
                'notes' => [
                    'content' => 'Great lesson on massage techniques'
                ]
            ]);
    }

    public function test_user_cannot_view_lesson_progress_for_non_enrolled_course()
    {
        $otherCourse = Course::factory()->published()->create();
        $otherModule = Module::factory()->create(['course_id' => $otherCourse->id]);
        $otherLesson = Lesson::factory()->create(['module_id' => $otherModule->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/progress/lesson/{$otherLesson->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Access denied. Please enroll in the course to view this lesson progress.'
            ]);
    }

    public function test_progress_analytics_calculates_streak_correctly()
    {
        // Create lesson progress for consecutive days
        $module = Module::factory()->create(['course_id' => $this->course->id]);
        $lesson = Lesson::factory()->create(['module_id' => $module->id]);

        for ($i = 0; $i < 5; $i++) {
            LessonProgress::factory()->create([
                'user_id' => $this->user->id,
                'lesson_id' => $lesson->id,
                'updated_at' => now()->subDays($i),
                'time_spent' => 30
            ]);
        }

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/progress/analytics');

        $response->assertStatus(200);
        
        $analytics = $response->json();
        $this->assertGreaterThan(0, $analytics['learning_streak']['current_streak']);
    }

    public function test_unauthenticated_user_cannot_access_progress_endpoints()
    {
        $endpoints = [
            'GET /api/progress',
            'GET /api/progress/analytics',
            "GET /api/progress/course/{$this->course->id}",
        ];

        foreach ($endpoints as $endpoint) {
            [$method, $url] = explode(' ', $endpoint);
            $response = $this->json($method, $url);
            $response->assertStatus(401);
        }
    }

    public function test_progress_not_found_returns_404()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/progress/course/99999');

        $response->assertStatus(404);
    }
}
