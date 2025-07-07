<?php

namespace Database\Factories;

use App\Models\UserCertificate;
use App\Models\User;
use App\Models\Certificate;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserCertificateFactory extends Factory
{
    protected $model = UserCertificate::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'certificate_id' => Certificate::factory(),
            'course_id' => Course::factory(),
            'certificate_number' => $this->faker->unique()->numerify('CERT-######'),
            'issued_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'file_path' => 'certificates/' . $this->faker->uuid() . '.pdf',
            'verification_code' => $this->faker->unique()->bothify('??##??##'),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    public function forCourse(Course $course): static
    {
        return $this->state(fn (array $attributes) => [
            'course_id' => $course->id,
        ]);
    }

    public function withVerificationCode(string $code): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_code' => $code,
        ]);
    }
}
