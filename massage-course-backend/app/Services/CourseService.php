<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use App\Models\UserProgress;
use Illuminate\Support\Facades\DB;

class CourseService
{
    /**
     * Enroll a user in a course.
     */
    public function enrollUser(User $user, Course $course): CourseEnrollment
    {
        return DB::transaction(function () use ($user, $course) {
            $enrollment = CourseEnrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'enrolled_at' => now(),
                'progress_percentage' => 0
            ]);

            // Create initial progress record
            UserProgress::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'completed_lessons' => 0,
                'total_lessons' => $course->total_lessons,
                'progress_percentage' => 0,
                'time_spent_minutes' => 0,
                'started_at' => now()
            ]);

            return $enrollment;
        });
    }

    /**
     * Get course statistics for a user.
     */
    public function getCourseStatistics(User $user, Course $course): array
    {
        $progress = $user->getProgressForCourse($course);
        
        if (!$progress) {
            return [
                'total_lessons' => $course->total_lessons,
                'completed_lessons' => 0,
                'progress_percentage' => 0,
                'time_spent_minutes' => 0,
                'estimated_completion_time' => $course->duration_hours * 60,
                'is_completed' => false
            ];
        }

        return [
            'total_lessons' => $progress->total_lessons,
            'completed_lessons' => $progress->completed_lessons,
            'progress_percentage' => $progress->progress_percentage,
            'time_spent_minutes' => $progress->time_spent_minutes,
            'estimated_completion_time' => $course->duration_hours * 60,
            'is_completed' => $progress->is_completed,
            'started_at' => $progress->started_at,
            'completed_at' => $progress->completed_at
        ];
    }

    /**
     * Calculate and update course progress for a user.
     */
    public function updateCourseProgress(User $user, Course $course): void
    {
        $progress = $user->getProgressForCourse($course);
        
        if ($progress) {
            $progress->updateProgress();
        }
    }

    /**
     * Get recommended courses for a user.
     */
    public function getRecommendedCourses(User $user, int $limit = 6): array
    {
        // Simple recommendation logic - can be enhanced with ML
        $enrolledCourseIds = $user->enrolledCourses()->pluck('course_id');
        
        $recommendedCourses = Course::published()
            ->whereNotIn('id', $enrolledCourseIds)
            ->orderBy('enrolled_students_count', 'desc')
            ->limit($limit)
            ->get();

        return $recommendedCourses->toArray();
    }

    /**
     * Get course completion rate.
     */
    public function getCourseCompletionRate(Course $course): float
    {
        $totalEnrollments = $course->enrollments()->count();
        
        if ($totalEnrollments === 0) {
            return 0;
        }

        $completedEnrollments = $course->enrollments()
            ->whereNotNull('completed_at')
            ->count();

        return ($completedEnrollments / $totalEnrollments) * 100;
    }

    /**
     * Get popular courses based on enrollment.
     */
    public function getPopularCourses(int $limit = 10): array
    {
        return Course::published()
            ->withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get course analytics data.
     */
    public function getCourseAnalytics(Course $course): array
    {
        $enrollments = $course->enrollments();
        
        return [
            'total_enrollments' => $enrollments->count(),
            'completed_enrollments' => $enrollments->whereNotNull('completed_at')->count(),
            'completion_rate' => $this->getCourseCompletionRate($course),
            'average_progress' => $enrollments->avg('progress_percentage') ?: 0,
            'total_revenue' => $course->payments()->where('status', 'succeeded')->sum('amount'),
            'enrollment_trends' => $this->getEnrollmentTrends($course)
        ];
    }

    /**
     * Get enrollment trends for the last 30 days.
     */
    private function getEnrollmentTrends(Course $course): array
    {
        $trends = [];
        
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $count = $course->enrollments()
                ->whereDate('enrolled_at', $date)
                ->count();
            
            $trends[] = [
                'date' => $date,
                'enrollments' => $count
            ];
        }

        return $trends;
    }
}
