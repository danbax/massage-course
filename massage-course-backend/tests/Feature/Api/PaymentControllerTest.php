<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PaymentControllerTest extends TestCase
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
    }

    public function test_user_can_view_payment_history()
    {
        // Create some payment history
        Payment::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'status' => 'succeeded'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/payments');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'course' => [
                            'id',
                            'title',
                            'thumbnail_url'
                        ],
                        'amount',
                        'currency',
                        'status',
                        'payment_method',
                        'payment_provider',
                        'processed_at',
                        'created_at'
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

    public function test_user_can_create_payment_intent()
    {
        Http::fake([
            'api.stripe.com/*' => Http::response([
                'id' => 'pi_test_payment_intent',
                'client_secret' => 'pi_test_client_secret',
                'status' => 'requires_payment_method',
                'amount' => $this->course->price * 100,
                'currency' => 'usd'
            ], 200)
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/payments/intent', [
            'course_id' => $this->course->id,
            'payment_method' => 'stripe'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'payment_intent' => [
                    'id',
                    'client_secret',
                    'status'
                ],
                'course' => [
                    'id',
                    'title',
                    'price'
                ]
            ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'status' => 'pending'
        ]);
    }

    public function test_user_cannot_create_payment_intent_for_invalid_course()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/payments/intent', [
            'course_id' => 99999,
            'payment_method' => 'stripe'
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Course not found'
            ]);
    }

    public function test_user_can_confirm_payment()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'status' => 'pending',
            'provider_transaction_id' => 'pi_test_payment_intent'
        ]);

        Http::fake([
            'api.stripe.com/*' => Http::response([
                'id' => 'pi_test_payment_intent',
                'status' => 'succeeded',
                'amount_received' => $this->course->price * 100,
                'charges' => [
                    'data' => [[
                        'payment_method_details' => [
                            'card' => [
                                'last4' => '4242',
                                'brand' => 'visa'
                            ]
                        ]
                    ]]
                ]
            ], 200)
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/payments/confirm', [
            'payment_intent_id' => 'pi_test_payment_intent'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'payment' => [
                    'id',
                    'status',
                    'amount',
                    'course'
                ],
                'enrollment' => [
                    'id',
                    'enrolled_at'
                ]
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'succeeded'
        ]);

        $this->assertDatabaseHas('course_enrollments', [
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'payment_id' => $payment->id
        ]);
    }

    public function test_user_can_view_specific_payment()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'status' => 'succeeded'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/payments/{$payment->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'course' => [
                    'id',
                    'title'
                ],
                'amount',
                'currency',
                'status',
                'payment_method',
                'payment_provider',
                'provider_transaction_id',
                'payment_data',
                'processed_at',
                'created_at',
                'updated_at'
            ])
            ->assertJson([
                'id' => $payment->id,
                'status' => 'succeeded'
            ]);
    }

    public function test_user_cannot_view_other_users_payment()
    {
        $otherUser = User::factory()->create();
        $payment = Payment::factory()->create([
            'user_id' => $otherUser->id,
            'course_id' => $this->course->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson("/api/payments/{$payment->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Access denied'
            ]);
    }

    public function test_stripe_webhook_handles_successful_payment()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'status' => 'pending',
            'provider_transaction_id' => 'pi_test_payment_intent'
        ]);

        $webhookPayload = [
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_test_payment_intent',
                    'status' => 'succeeded',
                    'amount_received' => $this->course->price * 100,
                    'charges' => [
                        'data' => [[
                            'payment_method_details' => [
                                'card' => [
                                    'last4' => '4242',
                                    'brand' => 'visa'
                                ]
                            ]
                        ]]
                    ]
                ]
            ]
        ];

        $response = $this->postJson('/api/webhooks/stripe', $webhookPayload);

        $response->assertStatus(200)
            ->assertJson([
                'received' => true
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'succeeded'
        ]);
    }

    public function test_stripe_webhook_handles_failed_payment()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'status' => 'pending',
            'provider_transaction_id' => 'pi_test_payment_intent'
        ]);

        $webhookPayload = [
            'type' => 'payment_intent.payment_failed',
            'data' => [
                'object' => [
                    'id' => 'pi_test_payment_intent',
                    'status' => 'requires_payment_method',
                    'last_payment_error' => [
                        'message' => 'Your card was declined.'
                    ]
                ]
            ]
        ];

        $response = $this->postJson('/api/webhooks/stripe', $webhookPayload);

        $response->assertStatus(200)
            ->assertJson([
                'received' => true
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'failed'
        ]);
    }

    public function test_payment_intent_validation()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/payments/intent', [
            'course_id' => '',
            'payment_method' => 'invalid_method'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['course_id', 'payment_method']);
    }

    public function test_payment_confirmation_validation()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/payments/confirm', [
            'payment_intent_id' => ''
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['payment_intent_id']);
    }

    public function test_user_cannot_pay_for_already_enrolled_course()
    {
        // Create existing enrollment
        \App\Models\CourseEnrollment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/payments/intent', [
            'course_id' => $this->course->id,
            'payment_method' => 'stripe'
        ]);

        $response->assertStatus(409)
            ->assertJson([
                'message' => 'Already enrolled in this course'
            ]);
    }

    public function test_unauthenticated_user_cannot_access_payment_endpoints()
    {
        $endpoints = [
            'GET /api/payments',
            'POST /api/payments/intent',
            'POST /api/payments/confirm',
            'GET /api/payments/1'
        ];

        foreach ($endpoints as $endpoint) {
            [$method, $url] = explode(' ', $endpoint);
            $response = $this->json($method, $url);
            $response->assertStatus(401);
        }
    }

    public function test_payment_not_found_returns_404()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/payments/99999');

        $response->assertStatus(404);
    }
}
