<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Lesson;
use App\Models\UserProgress;
use App\Models\LessonProgress;
use Illuminate\Database\Seeder;

class UserProgressSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'student')->get();
        $totalLessons = Lesson::where('language', 'en')->count();

        if ($totalLessons === 0) {
            $this->command->error('No lessons found. Please run MassageCourseContentSeeder first.');
            return;
        }

        foreach ($users as $user) {
            $userLanguage = $user->language ?? 'en';
            $userTotalLessons = Lesson::where('language', $userLanguage)->count();
            
            if ($userTotalLessons === 0) {
                $userLanguage = 'en';
                $userTotalLessons = $totalLessons;
            }

            $completedLessons = fake()->numberBetween(0, $userTotalLessons);
            $progressPercentage = $userTotalLessons > 0 ? round(($completedLessons / $userTotalLessons) * 100, 2) : 0;
            $timeSpent = $completedLessons * fake()->numberBetween(15, 45);
            
            $lastLesson = null;
            if ($completedLessons > 0) {
                $lastLesson = Lesson::where('language', $userLanguage)
                    ->inRandomOrder()
                    ->first();
            }
            
            $userProgress = UserProgress::create([
                'user_id' => $user->id,
                'completed_lessons' => $completedLessons,
                'total_lessons' => $userTotalLessons,
                'progress_percentage' => $progressPercentage,
                'last_lesson_id' => $lastLesson ? $lastLesson->id : null,
                'time_spent_minutes' => $timeSpent,
                'started_at' => $completedLessons > 0 ? fake()->dateTimeBetween('-6 months', 'now') : null,
                'completed_at' => $progressPercentage === 100 ? fake()->dateTimeBetween('-1 month', 'now') : null,
            ]);

            if ($completedLessons > 0) {
                $lessons = Lesson::where('language', $userLanguage)
                    ->inRandomOrder()
                    ->limit($completedLessons)
                    ->get();

                foreach ($lessons as $lesson) {
                    LessonProgress::create([
                        'user_id' => $user->id,
                        'lesson_id' => $lesson->id,
                        'watch_time_seconds' => fake()->numberBetween(300, 3600),
                        'watch_percentage' => fake()->numberBetween(80, 100),
                        'is_completed' => true,
                        'completed_at' => fake()->dateTimeBetween('-3 months', 'now'),
                        'quiz_score' => fake()->boolean(70) ? fake()->numberBetween(70, 100) : null,
                        'quiz_attempts' => fake()->numberBetween(1, 3),
                        'notes' => fake()->boolean(30) ? fake()->sentence() : null,
                    ]);
                }
            }
        }

        $this->command->info("Created progress records for {$users->count()} students");
    }
}