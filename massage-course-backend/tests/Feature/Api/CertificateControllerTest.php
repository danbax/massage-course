<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use App\Models\User;
use App\Models\Certificate;
use App\Models\UserCertificate;
use App\Models\CourseEnrollment;
use App\Models\UserProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CertificateControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private string $token;
    private Course $course;
    private Certificate $certificate;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
        
        $this->course = Course::factory()->published()->create();
        $this->certificate = Certificate::factory()->create([
            'course_id' => $this->course->id
        ]);
        
        // Enroll user in course
        CourseEnrollment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);
    }

    public function test_user_can_view_earned_certificates()
    {
        // Create some earned certificates
        UserCertificate::factory()->count(3)->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/certificates');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'certificate' => [
                            'id',
                            'name',
                            'description',
                            'course' => [
                                'id',
                                'title'
                            ]
                        ],
                        'certificate_code',
                        'issued_at',
                        'expires_at',
                        'download_url',
                        'verification_url'
                    ]
                ],
                'meta' => [
                    'current_page',
                    'per_page',
                    'total'
                ]
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_view_specific_certificate()
    {
        $userCertificate = UserCertificate::factory()->create([
            'user_id' => $this->user->id,
            'certificate_id' => $this->certificate->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/certificates/{$userCertificate->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'certificate' => [
                    'id',
                    'name',
                    'description',
                    'template_path',
                    'requirements',
                    'design_config',
                    'course' => [
                        'id',
                        'title',
                        'instructor'
                    ]
                ],
                'user' => [
                    'id',
                    'name',
                    'email'
                ],
                'certificate_code',
                'issued_at',
                'expires_at',
                'verification_data' => [
                    'course_completion_date',
                    'final_grade',
                    'total_hours'
                ]
            ])
            ->assertJson([
                'id' => $userCertificate->id,
                'certificate_code' => $userCertificate->certificate_code
            ]);
    }

    public function test_user_cannot_view_other_users_certificate()
    {
        $otherUser = User::factory()->create();
        $userCertificate = UserCertificate::factory()->create([
            'user_id' => $otherUser->id,
            'certificate_id' => $this->certificate->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/certificates/{$userCertificate->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Access denied'
            ]);
    }

    public function test_user_can_download_certificate()
    {
        $userCertificate = UserCertificate::factory()->create([
            'user_id' => $this->user->id,
            'certificate_id' => $this->certificate->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->get("/api/certificates/{$userCertificate->id}/download");

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'application/pdf')
            ->assertHeader('Content-Disposition', 'attachment; filename="certificate_' . $userCertificate->certificate_code . '.pdf"');
    }

    public function test_user_can_generate_certificate_when_eligible()
    {
        // Mark course as completed
        UserProgress::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'progress_percentage' => 100,
            'completed_at' => now()
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/certificates/generate/{$this->course->id}");

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'certificate' => [
                    'id',
                    'certificate_code',
                    'issued_at',
                    'download_url',
                    'verification_url'
                ]
            ]);

        $this->assertDatabaseHas('user_certificates', [
            'user_id' => $this->user->id,
            'certificate_id' => $this->certificate->id
        ]);
    }

    public function test_user_cannot_generate_certificate_when_not_eligible()
    {
        // Course not completed
        UserProgress::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'progress_percentage' => 50,
            'completed_at' => null
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/certificates/generate/{$this->course->id}");

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Certificate requirements not met',
                'requirements' => [
                    'course_completed' => false
                ]
            ]);
    }

    public function test_user_cannot_generate_duplicate_certificate()
    {
        // Mark course as completed
        UserProgress::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'progress_percentage' => 100,
            'completed_at' => now()
        ]);

        // Create existing certificate
        UserCertificate::factory()->create([
            'user_id' => $this->user->id,
            'certificate_id' => $this->certificate->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/certificates/generate/{$this->course->id}");

        $response->assertStatus(409)
            ->assertJson([
                'message' => 'Certificate already issued for this course'
            ]);
    }

    public function test_user_cannot_generate_certificate_for_non_enrolled_course()
    {
        $otherCourse = Course::factory()->published()->create();
        Certificate::factory()->create(['course_id' => $otherCourse->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/certificates/generate/{$otherCourse->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Not enrolled in this course'
            ]);
    }

    public function test_public_certificate_verification_works()
    {
        $userCertificate = UserCertificate::factory()->create([
            'user_id' => $this->user->id,
            'certificate_id' => $this->certificate->id,
            'certificate_code' => 'CERT-TEST-12345'
        ]);

        $response = $this->getJson("/api/certificates/verify/CERT-TEST-12345");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'valid' => true,
                'certificate' => [
                    'certificate_code',
                    'recipient_name',
                    'course_title',
                    'instructor_name',
                    'issued_at',
                    'expires_at',
                    'issuing_organization'
                ],
                'verification_details' => [
                    'verified_at',
                    'verification_status'
                ]
            ])
            ->assertJson([
                'valid' => true,
                'certificate' => [
                    'certificate_code' => 'CERT-TEST-12345'
                ]
            ]);
    }

    public function test_invalid_certificate_code_returns_not_found()
    {
        $response = $this->getJson('/api/certificates/verify/INVALID-CODE');

        $response->assertStatus(404)
            ->assertJson([
                'valid' => false,
                'message' => 'Certificate not found'
            ]);
    }

    public function test_expired_certificate_shows_expired_status()
    {
        $userCertificate = UserCertificate::factory()->create([
            'user_id' => $this->user->id,
            'certificate_id' => $this->certificate->id,
            'certificate_code' => 'CERT-EXPIRED-12345',
            'expires_at' => now()->subDays(30)
        ]);

        $response = $this->getJson("/api/certificates/verify/CERT-EXPIRED-12345");

        $response->assertStatus(200)
            ->assertJson([
                'valid' => false,
                'certificate' => [
                    'certificate_code' => 'CERT-EXPIRED-12345'
                ],
                'verification_details' => [
                    'verification_status' => 'expired'
                ]
            ]);
    }

    public function test_certificate_requirements_validation()
    {
        // Test with certificate that requires quiz scores
        $certificate = Certificate::factory()->create([
            'course_id' => $this->course->id,
            'requirements' => json_encode([
                'complete_all_lessons' => true,
                'minimum_quiz_score' => 80,
                'practical_assessment' => true
            ])
        ]);

        UserProgress::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'progress_percentage' => 100,
            'completed_at' => now()
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson("/api/certificates/generate/{$this->course->id}");

        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'requirements' => [
                    'course_completed',
                    'minimum_quiz_score',
                    'practical_assessment'
                ]
            ]);
    }

    public function test_unauthenticated_user_cannot_access_certificate_endpoints()
    {
        $endpoints = [
            'GET /api/certificates',
            'GET /api/certificates/1',
            'GET /api/certificates/1/download',
            'POST /api/certificates/generate/1'
        ];

        foreach ($endpoints as $endpoint) {
            [$method, $url] = explode(' ', $endpoint);
            $response = $this->json($method, $url);
            $response->assertStatus(401);
        }
    }

    public function test_certificate_not_found_returns_404()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/certificates/99999');

        $response->assertStatus(404);
    }
}
