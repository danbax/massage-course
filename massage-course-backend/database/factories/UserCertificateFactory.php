<?php

namespace Database\Factories;

use App\Models\UserCertificate;
use App\Models\User;
use App\Models\Certificate;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserCertificateFactory extends Factory
{
    protected $model = UserCertificate::class;

    public function definition(): array
    {
        $issueDate = $this->faker->dateTimeBetween('-6 months', 'now');
        
        return [
            'user_id' => User::factory(),
            'certificate_id' => Certificate::factory(),
            'certificate_number' => $this->generateCertificateNumber(),
            'issued_at' => $issueDate,
            'file_path' => 'certificates/user/' . $this->faker->uuid() . '.pdf',
            'verification_code' => $this->generateVerificationCode(),
            'created_at' => $issueDate,
            'updated_at' => $this->faker->dateTimeBetween($issueDate, 'now'),
        ];
    }

    private function generateCertificateNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $sequence = $this->faker->unique()->numberBetween(1000, 9999);
        
        return "MT-{$year}{$month}-{$sequence}";
    }

    private function generateVerificationCode(): string
    {
        return strtoupper($this->faker->bothify('??##??##'));
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    public function forCertificate(Certificate $certificate): static
    {
        return $this->state(fn (array $attributes) => [
            'certificate_id' => $certificate->id,
        ]);
    }

    public function withVerificationCode(string $code): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_code' => $code,
        ]);
    }

    public function recentlyIssued(): static
    {
        return $this->state(fn (array $attributes) => [
            'issued_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }
}