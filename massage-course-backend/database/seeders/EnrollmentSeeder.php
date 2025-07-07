<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\UserProgress;
use App\Models\LessonProgress;
use App\Models\Payment;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $courses = Course::where('is_published', true)->get();

        if ($students->isEmpty() || $courses->isEmpty()) {
            $this->command->error('No students or published courses found.');
            return;
        }

        $enrollmentCount = 0;

        foreach ($students as $student) {
            // Each student enrolls in 1-4 courses
            $coursesToEnroll = $courses->random(fake()->numberBetween(1, 4));

            foreach ($coursesToEnroll as $course) {
                // Create payment first
                $payment = Payment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'amount' => $course->price,
                    'currency' => $course->currency ?? 'USD',
                    'status' => 'succeeded',
                    'payment_method' => fake()->randomElement(['credit_card', 'paypal', 'bank_transfer']),
                    'payment_provider' => fake()->randomElement(['stripe', 'paypal']),
                    'provider_transaction_id' => 'txn_' . fake()->uuid(),
                    'payment_data' => json_encode([
                        'card_last_four' => fake()->numberBetween(1000, 9999),
                        'card_brand' => fake()->randomElement(['visa', 'mastercard', 'amex']),
                    ]),
                    'processed_at' => fake()->dateTimeBetween('-1 year', 'now'),
                ]);

                // Create enrollment
                $enrollment = CourseEnrollment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'payment_id' => $payment->id,
                    'enrolled_at' => $payment->processed_at,
                    'last_accessed_at' => fake()->dateTimeBetween($payment->processed_at, 'now'),
                ]);

                // Create course progress
                $progressPercentage = fake()->numberBetween(0, 100);
                $completedLessons = fake()->numberBetween(0, 20);
                $totalLessons = fake()->numberBetween($completedLessons, 25);

                $courseProgress = UserProgress::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'completed_lessons' => $completedLessons,
                    'total_lessons' => $totalLessons,
                    'progress_percentage' => $progressPercentage,
                    'last_lesson_id' => null, // Will be set later if needed
                    'time_spent_minutes' => fake()->numberBetween(30, $course->duration_hours * 60),
                    'started_at' => $enrollment->enrolled_at,
                    'completed_at' => $progressPercentage >= 95 ? fake()->dateTimeBetween($enrollment->enrolled_at, 'now') : null,
                ]);

                // Create lesson progress for some lessons
                $modules = $course->modules()->with('lessons')->get();
                foreach ($modules as $module) {
                    $lessons = $module->lessons;
                    $lessonsToComplete = $lessons->take(fake()->numberBetween(1, min($lessons->count(), 8)));

                    foreach ($lessonsToComplete as $lesson) {
                        $watchPercentage = fake()->numberBetween(0, 100);
                        $lessonCompleted = $watchPercentage >= 80;

                        LessonProgress::create([
                            'user_id' => $student->id,
                            'lesson_id' => $lesson->id,
                            'watch_time_seconds' => fake()->numberBetween(0, ($lesson->duration_minutes ?? 30) * 60),
                            'watch_percentage' => $watchPercentage,
                            'is_completed' => $lessonCompleted,
                            'completed_at' => $lessonCompleted ? fake()->dateTimeBetween($enrollment->enrolled_at, 'now') : null,
                            'quiz_score' => fake()->boolean(50) ? fake()->randomFloat(1, 60, 100) : null,
                            'quiz_attempts' => fake()->numberBetween(0, 3),
                            'notes' => fake()->boolean(30) ? fake()->paragraph() : null,
                        ]);
                    }
                }

                $enrollmentCount++;
            }
        }

        $this->command->info("Created {$enrollmentCount} enrollments with progress data");
    }
}
