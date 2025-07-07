<?php

namespace Database\Factories;

use App\Models\UserProgress;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserProgressFactory extends Factory
{
    protected $model = UserProgress::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'lessons_completed' => $this->faker->numberBetween(0, 20),
            'total_lessons' => $this->faker->numberBetween(20, 50),
            'progress_percentage' => $this->faker->numberBetween(0, 100),
            'last_accessed_at' => $this->faker->dateTimeBetween('-2 weeks', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'lessons_completed' => $attributes['total_lessons'],
            'progress_percentage' => 100,
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'lessons_completed' => $this->faker->numberBetween(1, $attributes['total_lessons'] - 1),
            'progress_percentage' => $this->faker->numberBetween(1, 99),
        ]);
    }

    public function notStarted(): static
    {
        return $this->state(fn (array $attributes) => [
            'lessons_completed' => 0,
            'progress_percentage' => 0,
        ]);
    }
}
