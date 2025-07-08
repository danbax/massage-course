<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Payment;
use App\Models\UserCertificate;
use App\Models\Certificate;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $coursePrice = 297.00;

        foreach ($students as $student) {
            if (fake()->boolean(70)) {
                $payment = Payment::create([
                    'user_id' => $student->id,
                    'stripe_payment_intent_id' => 'pi_' . fake()->uuid,
                    'amount' => $coursePrice,
                    'currency' => 'USD',
                    'status' => fake()->randomElement(['succeeded', 'succeeded', 'succeeded', 'failed', 'pending']),
                    'payment_method' => fake()->randomElement(['card', 'paypal']),
                    'payment_provider' => fake()->randomElement(['stripe', 'paypal']),
                    'provider_transaction_id' => 'txn_' . fake()->uuid,
                    'payment_data' => json_encode([
                        'card_last_four' => fake()->numberBetween(1000, 9999),
                        'card_brand' => fake()->randomElement(['visa', 'mastercard', 'amex']),
                        'customer_email' => $student->email,
                    ]),
                    'processed_at' => fake()->dateTimeBetween('-2 months', 'now'),
                ]);

                if ($payment->status === 'succeeded' && fake()->boolean(30)) {
                    $certificate = Certificate::first();
                    if ($certificate) {
                        UserCertificate::create([
                            'user_id' => $student->id,
                            'certificate_id' => $certificate->id,
                            'certificate_number' => 'MT-' . date('Y') . '-' . fake()->unique()->numberBetween(1000, 9999),
                            'issued_at' => fake()->dateTimeBetween('-1 month', 'now'),
                            'file_path' => 'certificates/' . $student->id . '_' . fake()->uuid() . '.pdf',
                            'verification_code' => strtoupper(fake()->bothify('??##??##')),
                        ]);
                    }
                }
            }
        }

        $this->command->info('Created payment and certificate records');
    }
}