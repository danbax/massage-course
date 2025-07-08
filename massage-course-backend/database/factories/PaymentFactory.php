<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'processing', 'succeeded', 'failed', 'refunded']);
        $amount = $this->faker->randomElement([197.00, 297.00, 497.00]); // Common course pricing
        
        return [
            'user_id' => User::factory(),
            'stripe_payment_intent_id' => $status !== 'pending' ? 'pi_' . $this->faker->uuid : null,
            'amount' => $amount,
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'GBP']),
            'status' => $status,
            'payment_method' => $this->faker->randomElement(['card', 'paypal', 'bank_transfer']),
            'payment_provider' => $this->faker->randomElement(['stripe', 'paypal']),
            'provider_transaction_id' => 'txn_' . $this->faker->uuid,
            'payment_data' => $this->generatePaymentData(),
            'processed_at' => in_array($status, ['succeeded', 'refunded']) ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'refunded_at' => $status === 'refunded' ? $this->faker->dateTimeBetween('-2 weeks', 'now') : null,
            'refund_amount' => $status === 'refunded' ? $amount : null,
            'created_at' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'updated_at' => now(),
        ];
    }

    private function generatePaymentData(): array
    {
        return [
            'card_last_four' => $this->faker->numberBetween(1000, 9999),
            'card_brand' => $this->faker->randomElement(['visa', 'mastercard', 'amex', 'discover']),
            'card_exp_month' => $this->faker->numberBetween(1, 12),
            'card_exp_year' => $this->faker->numberBetween(2024, 2030),
            'billing_country' => $this->faker->countryCode,
            'customer_email' => $this->faker->email,
        ];
    }

    public function succeeded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'succeeded',
            'processed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'stripe_payment_intent_id' => 'pi_' . $this->faker->uuid,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'processed_at' => null,
            'stripe_payment_intent_id' => 'pi_' . $this->faker->uuid,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'processed_at' => null,
            'stripe_payment_intent_id' => null,
        ]);
    }

    public function refunded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'refunded',
            'refunded_at' => $this->faker->dateTimeBetween('-2 weeks', 'now'),
            'refund_amount' => $attributes['amount'],
            'processed_at' => $this->faker->dateTimeBetween('-1 month', '-2 weeks'),
            'stripe_payment_intent_id' => 'pi_' . $this->faker->uuid,
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    public function massageTherapyCourse(): static
    {
        return $this->state(fn (array $attributes) => [
            'amount' => 297.00, // Standard massage therapy course price
            'currency' => 'USD',
        ]);
    }
}