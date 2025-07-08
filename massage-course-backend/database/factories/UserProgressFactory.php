<?php

namespace Database\Factories;

use App\Models\UserProgress;
use App\Models\User;
use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserProgressFactory extends Factory
{
    protected $model = UserProgress::class;

    public function definition(): array
    {
        $totalLessons = $this->faker->numberBetween(15, 25);
        $completedLessons = $this->faker->numberBetween(0, $totalLessons);
        $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0;

        return [
            'user_id' => User::factory(),
            'completed_lessons' => $completedLessons,
            'total_lessons' => $totalLessons,
            'progress_percentage' => $progressPercentage,
            'last_lesson_id' => $completedLessons > 0 ? Lesson::factory() : null,
            'time_spent_minutes' => $this->faker->numberBetween(0, $completedLessons * 45),
            'started_at' => $completedLessons > 0 ? $this->faker->dateTimeBetween('-6 months', 'now') : null,
            'completed_at' => $completedLessons === $totalLessons ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_lessons' => $attributes['total_lessons'],
            'progress_percentage' => 100,
            'completed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'time_spent_minutes' => $attributes['total_lessons'] * $this->faker->numberBetween(30, 60),
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_lessons' => $this->faker->numberBetween(1, $attributes['total_lessons'] - 1),
            'progress_percentage' => $this->faker->numberBetween(5, 95),
            'completed_at' => null,
            'started_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ]);
    }

    public function notStarted(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_lessons' => 0,
            'progress_percentage' => 0,
            'last_lesson_id' => null,
            'time_spent_minutes' => 0,
            'started_at' => null,
            'completed_at' => null,
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}