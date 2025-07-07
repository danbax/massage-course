<?php

namespace Database\Factories;

use App\Models\CourseEnrollment;
use App\Models\User;
use App\Models\Course;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseEnrollmentFactory extends Factory
{
    protected $model = CourseEnrollment::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'payment_id' => Payment::factory(),
            'enrolled_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'completed_at' => $this->faker->optional(0.3)->dateTimeBetween('-2 months', 'now'),
            'progress_percentage' => $this->faker->numberBetween(0, 100),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'progress_percentage' => 100,
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => null,
            'progress_percentage' => $this->faker->numberBetween(1, 99),
        ]);
    }

    public function notStarted(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => null,
            'progress_percentage' => 0,
        ]);
    }
}
