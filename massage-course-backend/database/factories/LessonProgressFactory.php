<?php

namespace Database\Factories;

use App\Models\LessonProgress;
use App\Models\User;
use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonProgressFactory extends Factory
{
    protected $model = LessonProgress::class;

    public function definition(): array
    {
        $isCompleted = $this->faker->boolean(60);
        $watchTimeSeconds = $this->faker->numberBetween(0, 3600);
        $videoDuration = $this->faker->numberBetween(300, 3600);
        $watchPercentage = min(100, round(($watchTimeSeconds / $videoDuration) * 100, 2));

        return [
            'user_id' => User::factory(),
            'lesson_id' => Lesson::factory(),
            'watch_time_seconds' => $watchTimeSeconds,
            'watch_percentage' => $watchPercentage,
            'is_completed' => $isCompleted,
            'completed_at' => $isCompleted ? $this->faker->dateTimeBetween('-3 months', 'now') : null,
            'quiz_score' => $this->faker->boolean(70) ? $this->faker->numberBetween(60, 100) : null,
            'quiz_attempts' => $this->faker->numberBetween(0, 3),
            'notes' => $this->faker->boolean(30) ? $this->faker->paragraph(2) : null,
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_completed' => true,
            'completed_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'watch_percentage' => $this->faker->numberBetween(80, 100),
            'quiz_score' => $this->faker->numberBetween(70, 100),
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_completed' => false,
            'completed_at' => null,
            'watch_percentage' => $this->faker->numberBetween(10, 79),
            'quiz_score' => null,
        ]);
    }

    public function notStarted(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_completed' => false,
            'completed_at' => null,
            'watch_time_seconds' => 0,
            'watch_percentage' => 0,
            'quiz_score' => null,
            'quiz_attempts' => 0,
            'notes' => null,
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    public function forLesson(Lesson $lesson): static
    {
        return $this->state(fn (array $attributes) => [
            'lesson_id' => $lesson->id,
        ]);
    }
}