<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'processing', 'succeeded', 'failed', 'refunded']);
        $course = Course::factory()->create();
        
        return [
            'user_id' => User::factory(),
            'course_id' => $course->id,
            'amount' => $course->price,
            'currency' => 'USD',
            'status' => $status,
            'payment_method' => $this->faker->randomElement(['card', 'paypal', 'bank_transfer']),
            'payment_provider' => $this->faker->randomElement(['stripe', 'paypal']),
            'provider_transaction_id' => 'txn_' . $this->faker->uuid,
            'payment_data' => $this->generatePaymentData(),
            'processed_at' => $status === 'succeeded' ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'refunded_at' => $status === 'refunded' ? $this->faker->dateTimeBetween('-2 weeks', 'now') : null,
            'refund_amount' => $status === 'refunded' ? $course->price : null,
            'created_at' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'updated_at' => now(),
        ];
    }

    /**
     * Generate payment data based on payment method
     */
    private function generatePaymentData(): array
    {
        return [
            'card_last_four' => $this->faker->numberBetween(1000, 9999),
            'card_brand' => $this->faker->randomElement(['visa', 'mastercard', 'amex', 'discover']),
        ];
    }

    /**
     * Indicate that the payment is completed.
     */
    public function succeeded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'succeeded',
            'processed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the payment failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'processed_at' => null,
        ]);
    }

    /**
     * Indicate that the payment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'processed_at' => null,
        ]);
    }

    /**
     * Indicate that the payment was refunded.
     */
    public function refunded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'refunded',
            'refunded_at' => $this->faker->dateTimeBetween('-2 weeks', 'now'),
            'refund_amount' => $attributes['amount'],
        ]);
    }
}
