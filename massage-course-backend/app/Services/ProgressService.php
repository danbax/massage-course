<?php

namespace App\Services;

use App\Events\CourseCompleted;
use App\Events\LessonCompleted;
use App\Models\Course;
use App\Models\LessonProgress;
use App\Models\User;
use App\Models\UserProgress;
use Illuminate\Support\Facades\DB;

class ProgressService
{
    /**
     * Update course progress for a user.
     */
    public function updateCourseProgress(User $user, Course $course): void
    {
        $progress = UserProgress::firstOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id
            ],
            [
                'completed_lessons' => 0,
                'total_lessons' => $course->total_lessons,
                'progress_percentage' => 0,
                'time_spent_minutes' => 0,
                'started_at' => now()
            ]
        );

        $progress->updateProgress();

        // Check if course is completed
        if ($progress->is_completed && !$progress->completed_at) {
            $this->markCourseAsCompleted($user, $course);
        }
    }

    /**
     * Update lesson progress.
     */
    public function updateLessonProgress(
        User $user, 
        $lessonId, 
        int $watchTimeSeconds, 
        float $watchPercentage,
        bool $isCompleted = false
    ): LessonProgress {
        $progress = LessonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lessonId
            ],
            [
                'watch_time_seconds' => $watchTimeSeconds,
                'watch_percentage' => $watchPercentage,
                'is_completed' => $isCompleted,
                'completed_at' => $isCompleted ? now() : null
            ]
        );

        // Fire lesson completed event if lesson was just completed
        if ($isCompleted && !$progress->wasRecentlyCreated) {
            event(new LessonCompleted($user, $progress->lesson));
        }

        return $progress;
    }

    /**
     * Mark course as completed.
     */
    private function markCourseAsCompleted(User $user, Course $course): void
    {
        $progress = $user->getProgressForCourse($course);
        
        if ($progress) {
            $progress->update(['completed_at' => now()]);

            // Update enrollment record
            $enrollment = $user->courseEnrollments()
                ->where('course_id', $course->id)
                ->first();
            
            if ($enrollment) {
                $enrollment->markAsCompleted();
            }

            // Fire course completed event
            event(new CourseCompleted($user, $course));
        }
    }

    /**
     * Get detailed progress analytics for a user.
     */
    public function getUserProgressAnalytics(User $user): array
    {
        $totalCourses = $user->courseEnrollments()->count();
        $completedCourses = $user->courseEnrollments()->whereNotNull('completed_at')->count();
        $totalTimeSpent = $user->courseProgress()->sum('time_spent_minutes');
        $totalLessonsCompleted = $user->lessonProgress()->where('is_completed', true)->count();

        return [
            'total_courses_enrolled' => $totalCourses,
            'completed_courses' => $completedCourses,
            'completion_rate' => $totalCourses > 0 ? ($completedCourses / $totalCourses) * 100 : 0,
            'total_time_spent_minutes' => $totalTimeSpent,
            'total_lessons_completed' => $totalLessonsCompleted,
            'certificates_earned' => $user->certificates()->count(),
            'current_streak' => $this->calculateLearningStreak($user),
            'average_session_time' => $this->calculateAverageSessionTime($user)
        ];
    }

    /**
     * Calculate learning streak (consecutive days of activity).
     */
    private function calculateLearningStreak(User $user): int
    {
        $streak = 0;
        $currentDate = now()->startOfDay();

        while (true) {
            $hasActivity = $user->lessonProgress()
                ->whereDate('updated_at', $currentDate)
                ->exists();

            if (!$hasActivity) {
                break;
            }

            $streak++;
            $currentDate->subDay();
        }

        return $streak;
    }

    /**
     * Calculate average session time in minutes.
     */
    private function calculateAverageSessionTime(User $user): float
    {
        // This would require session tracking - simplified for now
        $totalSessions = $user->courseEnrollments()->count();
        $totalTime = $user->courseProgress()->sum('time_spent_minutes');

        return $totalSessions > 0 ? $totalTime / $totalSessions : 0;
    }

    /**
     * Get progress statistics for a specific course.
     */
    public function getCourseProgressStats(Course $course): array
    {
        $enrollments = $course->enrollments();
        
        return [
            'total_enrollments' => $enrollments->count(),
            'completed_enrollments' => $enrollments->whereNotNull('completed_at')->count(),
            'average_completion_time' => $this->getAverageCompletionTime($course),
            'completion_rate' => $this->getCourseCompletionRate($course),
            'popular_lessons' => $this->getPopularLessons($course),
            'dropout_points' => $this->getDropoutPoints($course)
        ];
    }

    /**
     * Get average completion time for a course in days.
     */
    private function getAverageCompletionTime(Course $course): float
    {
        $completedEnrollments = $course->enrollments()
            ->whereNotNull('completed_at')
            ->whereNotNull('enrolled_at')
            ->get();

        if ($completedEnrollments->isEmpty()) {
            return 0;
        }

        $totalDays = $completedEnrollments->sum(function ($enrollment) {
            return $enrollment->enrolled_at->diffInDays($enrollment->completed_at);
        });

        return $totalDays / $completedEnrollments->count();
    }

    /**
     * Get course completion rate.
     */
    private function getCourseCompletionRate(Course $course): float
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
     * Get most popular lessons (highest completion rate).
     */
    private function getPopularLessons(Course $course): array
    {
        return $course->lessons()
            ->withCount(['progress as completed_count' => function ($query) {
                $query->where('is_completed', true);
            }])
            ->orderBy('completed_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($lesson) {
                return [
                    'lesson_id' => $lesson->id,
                    'title' => $lesson->title,
                    'completion_count' => $lesson->completed_count
                ];
            })
            ->toArray();
    }

    /**
     * Identify lessons where users commonly drop off.
     */
    private function getDropoutPoints(Course $course): array
    {
        // This would analyze where users stop progressing
        // Simplified implementation
        return [];
    }
}
