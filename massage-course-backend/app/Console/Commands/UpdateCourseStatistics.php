<?php

namespace App\Console\Commands;

use App\Models\Course;
use App\Models\User;
use App\Models\CourseEnrollment;
use App\Models\UserProgress;
use App\Models\LessonProgress;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateCourseStatistics extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'stats:update-courses 
                            {--course= : Update statistics for a specific course}
                            {--force : Force update even if recently updated}';

    /**
     * The console command description.
     */
    protected $description = 'Update course statistics including enrollments, completion rates, and analytics';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting course statistics update...');

        $courseId = $this->option('course');
        $force = $this->option('force');

        try {
            if ($courseId) {
                $this->updateCourseStatistics($courseId, $force);
            } else {
                $this->updateAllCourseStatistics($force);
            }

            $this->info('Course statistics update completed successfully!');
            return 0;
        } catch (\Exception $e) {
            $this->error('Course statistics update failed: ' . $e->getMessage());
            Log::error('Course statistics update command failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }

    /**
     * Update statistics for a specific course
     */
    private function updateCourseStatistics(int $courseId, bool $force): void
    {
        $course = Course::find($courseId);

        if (!$course) {
            throw new \Exception("Course with ID {$courseId} not found");
        }

        $this->updateCourseStats($course, $force);
        $this->info("Updated statistics for course: {$course->title}");
    }

    /**
     * Update statistics for all courses
     */
    private function updateAllCourseStatistics(bool $force): void
    {
        $courses = Course::all();
        $this->info("Updating statistics for {$courses->count()} courses...");

        $progressBar = $this->output->createProgressBar($courses->count());
        $progressBar->start();

        foreach ($courses as $course) {
            try {
                $this->updateCourseStats($course, $force);
                $progressBar->advance();
            } catch (\Exception $e) {
                $this->error("\nFailed to update stats for course {$course->title}: " . $e->getMessage());
            }
        }

        $progressBar->finish();
        $this->newLine();
    }

    /**
     * Update individual course statistics
     */
    private function updateCourseStats(Course $course, bool $force): void
    {
        // Check if recently updated (within last hour) unless forced
        if (!$force && $course->stats_updated_at && $course->stats_updated_at->gt(now()->subHour())) {
            return;
        }

        $stats = $this->calculateCourseStats($course);

        // Update course with calculated statistics
        $course->update([
            'total_enrollments' => $stats['total_enrollments'],
            'active_enrollments' => $stats['active_enrollments'],
            'completion_rate' => $stats['completion_rate'],
            'average_completion_time' => $stats['average_completion_time'],
            'average_rating' => $stats['average_rating'],
            'total_revenue' => $stats['total_revenue'],
            'stats_updated_at' => now(),
        ]);
    }

    /**
     * Calculate statistics for a course
     */
    private function calculateCourseStats(Course $course): array
    {
        // Total enrollments
        $totalEnrollments = CourseEnrollment::where('course_id', $course->id)->count();

        // Active enrollments (enrolled in last 30 days or still active)
        $activeEnrollments = CourseEnrollment::where('course_id', $course->id)
            ->where(function ($query) {
                $query->where('last_accessed_at', '>=', now()->subDays(30))
                      ->orWhereNull('last_accessed_at');
            })
            ->count();

        // Completion rate
        $completedEnrollments = UserProgress::where('course_id', $course->id)
            ->where('is_completed', true)
            ->count();

        $completionRate = $totalEnrollments > 0 ? ($completedEnrollments / $totalEnrollments) * 100 : 0;

        // Average completion time (in hours)
        $averageCompletionTime = UserProgress::where('course_id', $course->id)
            ->where('is_completed', true)
            ->whereNotNull('completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_time')
            ->value('avg_time') ?? 0;

        // Average rating (if reviews system is implemented)
        $averageRating = 0; // Placeholder for future review system

        // Total revenue
        $totalRevenue = DB::table('payments')
            ->where('course_id', $course->id)
            ->where('status', 'completed')
            ->sum('amount') ?? 0;

        // Additional analytics
        $this->updateDetailedAnalytics($course);

        return [
            'total_enrollments' => $totalEnrollments,
            'active_enrollments' => $activeEnrollments,
            'completion_rate' => round($completionRate, 2),
            'average_completion_time' => round($averageCompletionTime, 2),
            'average_rating' => $averageRating,
            'total_revenue' => $totalRevenue,
        ];
    }

    /**
     * Update detailed analytics for the course
     */
    private function updateDetailedAnalytics(Course $course): void
    {
        // Calculate lesson-level statistics
        $lessonStats = DB::table('lesson_progress')
            ->join('lessons', 'lesson_progress.lesson_id', '=', 'lessons.id')
            ->join('modules', 'lessons.module_id', '=', 'modules.id')
            ->where('modules.course_id', $course->id)
            ->selectRaw('
                lessons.id,
                lessons.title,
                COUNT(*) as total_views,
                AVG(lesson_progress.watch_percentage) as avg_watch_percentage,
                COUNT(CASE WHEN lesson_progress.is_completed = 1 THEN 1 END) as completions
            ')
            ->groupBy('lessons.id', 'lessons.title')
            ->get();

        // Store lesson statistics (you might want to create a separate table for this)
        Log::info('Lesson statistics calculated for course', [
            'course_id' => $course->id,
            'lesson_count' => $lessonStats->count(),
        ]);

        // Calculate user engagement metrics
        $engagementStats = CourseEnrollment::where('course_id', $course->id)
            ->selectRaw('
                AVG(DATEDIFF(COALESCE(last_accessed_at, NOW()), enrolled_at)) as avg_engagement_days,
                COUNT(CASE WHEN last_accessed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as weekly_active_users,
                COUNT(CASE WHEN last_accessed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as monthly_active_users
            ')
            ->first();

        Log::info('Engagement statistics calculated for course', [
            'course_id' => $course->id,
            'avg_engagement_days' => $engagementStats->avg_engagement_days ?? 0,
            'weekly_active_users' => $engagementStats->weekly_active_users ?? 0,
            'monthly_active_users' => $engagementStats->monthly_active_users ?? 0,
        ]);
    }
}
