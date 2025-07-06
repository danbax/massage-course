<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\User;
use App\Models\CourseEnrollment;
use App\Models\LessonProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LessonControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private string $token;
    private Course $course;
    private Module $module;
    private Lesson $lesson;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
        
        $this->course = Course::factory()->published()->create();
        $this->module = Module::factory()->create(['course_id' => $this->course->id]);
        $this->lesson = Lesson::factory()->create(['module_id' => $this->module->id]);
        
        // Enroll user in course
        CourseEnrollment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);
    }

    public function test_enrolled_user_can_view_lesson()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/lessons/{$this->lesson->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'title',
                'description',
                'content',
                'video_url',
                'video_duration',
                'order',
                'is_published',
                'is_free',
                'resources',
                'learning_objectives',
                'estimated_duration',
                'difficulty_level',
                'module' => [
                    'id',
                    'title',
                    'course' => [
                        'id',
                        'title'
                    ]
                ],
                'progress' => [
                    'is_completed',
                    'progress_percentage',
                    'time_spent',
                    'last_accessed_at'
                ]
            ])
            ->assertJson([
                'id' => $this->lesson->id,
                'title' => $this->lesson->title
            ]);
    }

    public function test_non_enrolled_user_cannot_view_paid_lesson()
    {
        $otherUser = User::factory()->create();
        $otherToken = $otherUser->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $otherToken,
        ])->getJson("/api/lessons/{$this->lesson->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Access denied. Please enroll in the course to view this lesson.'
            ]);
    }

    public function test_anyone_can_view_free_lesson()
    {
        $freeLesson = Lesson::factory()->create([
            'module_id' => $this->module->id,
            'is_free' => true
        ]);

        $otherUser = User::factory()->create();
        $otherToken = $otherUser->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $otherToken,
        ])->getJson("/api/lessons/{$freeLesson->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $freeLesson->id,
                'is_free' => true
            ]);
    }

    public function test_user_can_update_lesson_progress()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/lessons/{$this->lesson->id}/progress", [
            'progress_percentage' => 75,
            'time_spent' => 30
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'progress' => [
                    'progress_percentage',
                    'time_spent',
                    'last_accessed_at'
                ]
            ]);

        $this->assertDatabaseHas('lesson_progress', [
            'user_id' => $this->user->id,
            'lesson_id' => $this->lesson->id,
            'progress_percentage' => 75,
            'time_spent' => 30
        ]);
    }

    public function test_user_can_mark_lesson_as_completed()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/lessons/{$this->lesson->id}/complete");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'progress' => [
                    'is_completed',
                    'completed_at',
                    'progress_percentage'
                ]
            ]);

        $this->assertDatabaseHas('lesson_progress', [
            'user_id' => $this->user->id,
            'lesson_id' => $this->lesson->id,
            'is_completed' => true,
            'progress_percentage' => 100
        ]);
    }

    public function test_user_can_submit_quiz_answers()
    {
        $lesson = Lesson::factory()->create([
            'module_id' => $this->module->id,
            'has_quiz' => true,
            'quiz_questions' => json_encode([
                [
                    'id' => 1,
                    'question' => 'What is massage therapy?',
                    'type' => 'multiple_choice',
                    'options' => ['A', 'B', 'C', 'D'],
                    'correct_answer' => 'A'
                ],
                [
                    'id' => 2,
                    'question' => 'Name a benefit of massage.',
                    'type' => 'text',
                    'correct_answer' => 'relaxation'
                ]
            ])
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/lessons/{$lesson->id}/quiz", [
            'answers' => [
                ['question_id' => 1, 'answer' => 'A'],
                ['question_id' => 2, 'answer' => 'relaxation']
            ]
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'score',
                'total_questions',
                'correct_answers',
                'percentage',
                'passed',
                'results' => [
                    '*' => [
                        'question_id',
                        'is_correct',
                        'user_answer',
                        'correct_answer'
                    ]
                ]
            ]);

        $this->assertDatabaseHas('lesson_progress', [
            'user_id' => $this->user->id,
            'lesson_id' => $lesson->id
        ]);
    }

    public function test_user_can_get_lesson_notes()
    {
        // Create existing notes
        LessonProgress::factory()->create([
            'user_id' => $this->user->id,
            'lesson_id' => $this->lesson->id,
            'notes' => 'My lesson notes'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/lessons/{$this->lesson->id}/notes");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'notes',
                'updated_at'
            ])
            ->assertJson([
                'notes' => 'My lesson notes'
            ]);
    }

    public function test_user_can_update_lesson_notes()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/lessons/{$this->lesson->id}/notes", [
            'notes' => 'Updated lesson notes'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'notes' => [
                    'content',
                    'updated_at'
                ]
            ]);

        $this->assertDatabaseHas('lesson_progress', [
            'user_id' => $this->user->id,
            'lesson_id' => $this->lesson->id,
            'notes' => 'Updated lesson notes'
        ]);
    }

    public function test_quiz_submission_validation()
    {
        $lesson = Lesson::factory()->create([
            'module_id' => $this->module->id,
            'has_quiz' => true
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/lessons/{$lesson->id}/quiz", [
            'answers' => []
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);
    }

    public function test_progress_update_validation()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->putJson("/api/lessons/{$this->lesson->id}/progress", [
            'progress_percentage' => 150, // Invalid percentage
            'time_spent' => -10 // Invalid time
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['progress_percentage', 'time_spent']);
    }

    public function test_unauthenticated_user_cannot_access_lesson_endpoints()
    {
        $endpoints = [
            ['GET', "/api/lessons/{$this->lesson->id}"],
            ['PUT', "/api/lessons/{$this->lesson->id}/progress"],
            ['POST', "/api/lessons/{$this->lesson->id}/complete"],
            ['POST', "/api/lessons/{$this->lesson->id}/quiz"],
            ['GET', "/api/lessons/{$this->lesson->id}/notes"],
            ['PUT', "/api/lessons/{$this->lesson->id}/notes"]
        ];

        foreach ($endpoints as [$method, $url]) {
            $response = $this->json($method, $url);
            $response->assertStatus(401);
        }
    }

    public function test_lesson_not_found_returns_404()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/lessons/99999');

        $response->assertStatus(404);
    }
}
