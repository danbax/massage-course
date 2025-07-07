<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PaymentControllerTestFixed extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private Course $course;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->course = Course::factory()->published()->create();
    }

    public function test_user_can_view_payment_history()
    {
        // Create some payment history
        Payment::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'status' => 'succeeded'
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/payments');

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
                        'created_at'
                    ]
                ],
                'meta' => [
                    'current_page',
                    'per_page',
                    'total'
                ]
            ]);
    }

    public function test_user_can_create_payment_intent()
    {
        Http::fake([
            'api.stripe.com/*' => Http::response([
                'id' => 'pi_test_123',
                'client_secret' => 'pi_test_123_secret_test',
                'status' => 'requires_payment_method'
            ], 200)
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/intent', [
                'course_id' => $this->course->id,
                'payment_method' => 'stripe'
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'payment_intent_id',
                'client_secret',
                'amount',
                'currency'
            ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'status' => 'pending'
        ]);
    }

    public function test_user_can_confirm_payment()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
            'status' => 'pending',
            'provider_transaction_id' => 'pi_test_123'
        ]);

        Http::fake([
            'api.stripe.com/*' => Http::response([
                'id' => 'pi_test_123',
                'status' => 'succeeded',
                'amount' => 9999,
                'currency' => 'usd'
            ], 200)
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/confirm', [
                'payment_intent_id' => 'pi_test_123'
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'payment' => [
                    'id',
                    'status',
                    'amount'
                ],
                'enrollment' => [
                    'id',
                    'course_id',
                    'user_id'
                ]
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'succeeded'
        ]);

        $this->assertDatabaseHas('course_enrollments', [
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);
    }

    public function test_user_can_view_specific_payment()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/payments/{$payment->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'course' => [
                    'id',
                    'title',
                    'price'
                ],
                'amount',
                'currency',
                'status',
                'payment_method',
                'payment_provider',
                'processed_at',
                'created_at'
            ])
            ->assertJson([
                'id' => $payment->id,
                'amount' => $payment->amount
            ]);
    }

    public function test_user_cannot_view_other_users_payment()
    {
        $otherUser = User::factory()->create();
        $payment = Payment::factory()->create([
            'user_id' => $otherUser->id,
            'course_id' => $this->course->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/payments/{$payment->id}");

        $response->assertStatus(404);
    }

    public function test_create_payment_intent_requires_valid_course()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/intent', [
                'course_id' => 99999,
                'payment_method' => 'stripe'
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['course_id']);
    }

    public function test_create_payment_intent_requires_valid_payment_method()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/intent', [
                'course_id' => $this->course->id,
                'payment_method' => 'invalid_method'
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['payment_method']);
    }

    public function test_payment_intent_fails_when_stripe_api_fails()
    {
        Http::fake([
            'api.stripe.com/*' => Http::response(['error' => 'API Error'], 400)
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/intent', [
                'course_id' => $this->course->id,
                'payment_method' => 'stripe'
            ]);

        $response->assertStatus(500)
            ->assertJson([
                'message' => 'Payment processing failed'
            ]);
    }

    public function test_confirm_payment_requires_valid_payment_intent_id()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/confirm', [
                'payment_intent_id' => ''
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['payment_intent_id']);
    }

    public function test_confirm_payment_fails_with_invalid_payment_intent()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/confirm', [
                'payment_intent_id' => 'invalid_pi_123'
            ]);

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Payment not found'
            ]);
    }

    public function test_webhook_can_process_stripe_payment_succeeded()
    {
        $payment = Payment::factory()->create([
            'status' => 'pending',
            'provider_transaction_id' => 'pi_test_webhook_123'
        ]);

        $webhookPayload = [
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_test_webhook_123',
                    'status' => 'succeeded',
                    'amount' => 9999,
                    'currency' => 'usd'
                ]
            ]
        ];

        $response = $this->postJson('/api/webhooks/stripe', $webhookPayload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'succeeded'
        ]);
    }

    public function test_webhook_can_process_stripe_payment_failed()
    {
        $payment = Payment::factory()->create([
            'status' => 'pending',
            'provider_transaction_id' => 'pi_test_webhook_failed_123'
        ]);

        $webhookPayload = [
            'type' => 'payment_intent.payment_failed',
            'data' => [
                'object' => [
                    'id' => 'pi_test_webhook_failed_123',
                    'status' => 'failed'
                ]
            ]
        ];

        $response = $this->postJson('/api/webhooks/stripe', $webhookPayload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'failed'
        ]);
    }

    public function test_webhook_ignores_unknown_event_types()
    {
        $webhookPayload = [
            'type' => 'unknown.event.type',
            'data' => [
                'object' => [
                    'id' => 'some_id'
                ]
            ]
        ];

        $response = $this->postJson('/api/webhooks/stripe', $webhookPayload);

        $response->assertStatus(200);
    }

    public function test_payment_history_is_paginated()
    {
        Payment::factory()->count(25)->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/payments?per_page=10');

        $response->assertStatus(200)
            ->assertJson([
                'meta' => [
                    'per_page' => 10,
                    'total' => 25
                ]
            ]);
    }

    public function test_payment_history_can_be_filtered_by_status()
    {
        Payment::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'status' => 'succeeded'
        ]);
        Payment::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'status' => 'failed'
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/payments?status=succeeded');

        $response->assertStatus(200);
        
        $data = $response->json('data');
        $this->assertCount(3, $data);
        
        foreach ($data as $payment) {
            $this->assertEquals('succeeded', $payment['status']);
        }
    }

    public function test_unauthenticated_user_cannot_access_payment_routes()
    {
        $response = $this->getJson('/api/payments');
        $response->assertStatus(401);

        $response = $this->postJson('/api/payments/intent', []);
        $response->assertStatus(401);

        $response = $this->postJson('/api/payments/confirm', []);
        $response->assertStatus(401);
    }
}
