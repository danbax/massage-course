<?php

namespace App\Services;

use App\Models\User;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Service for managing user progress in the single massage course.
 */
class ProgressService
{
    /**
     * Update the user's overall progress based on their lesson completions.
     */
    public function updateUserProgress(User $user): void
    {
        $userLanguage = $user->language ?? 'en';
        
        // Get total published lessons for this language
        $totalLessons = Lesson::where('language', $userLanguage)
            ->where('is_published', true)
            ->count();
            
        // Get completed lessons count
        $completedLessons = $user->lessonProgress()
            ->whereHas('lesson', function ($query) use ($userLanguage) {
                $query->where('language', $userLanguage)
                      ->where('is_published', true);
            })
            ->where('is_completed', true)
            ->count();
            
        // Calculate progress percentage
        $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0;
        
        // Get total time spent
        $totalTimeSpent = $user->lessonProgress()
            ->whereHas('lesson', function ($query) use ($userLanguage) {
                $query->where('language', $userLanguage);
            })
            ->sum('watch_time_seconds');
            
        $totalTimeMinutes = round($totalTimeSpent / 60);
        
        // Get the last completed lesson
        $lastCompletedLesson = $user->lessonProgress()
            ->whereHas('lesson', function ($query) use ($userLanguage) {
                $query->where('language', $userLanguage);
            })
            ->where('is_completed', true)
            ->latest('completed_at')
            ->first();
            
        // Get or create progress record
        $progress = $user->progress()->firstOrCreate(
            [],
            [
                'completed_lessons' => 0,
                'total_lessons' => $totalLessons,
                'progress_percentage' => 0,
                'time_spent_minutes' => 0,
                'started_at' => now()
            ]
        );
        
        // Update progress data
        $updateData = [
            'completed_lessons' => $completedLessons,
            'total_lessons' => $totalLessons,
            'progress_percentage' => $progressPercentage,
            'time_spent_minutes' => $totalTimeMinutes,
            'last_lesson_id' => $lastCompletedLesson?->lesson_id,
        ];
        
        // Set started_at if this is the first progress update
        if (!$progress->started_at) {
            $updateData['started_at'] = now();
        }
        
        // Set completed_at if course is now complete
        if ($progressPercentage >= 100 && !$progress->completed_at) {
            $updateData['completed_at'] = now();
        }
        
        $progress->update($updateData);
        
        Log::info('User progress updated', [
            'user_id' => $user->id,
            'completed_lessons' => $completedLessons,
            'total_lessons' => $totalLessons,
            'progress_percentage' => $progressPercentage
        ]);
    }
    
    /**
     * Get detailed progress analytics for the user.
     */
    public function getUserProgressAnalytics(User $user, string $language): array
    {
        $progress = $user->progress;
        
        if (!$progress) {
            return [
                'overall_progress' => 0,
                'completed_lessons' => 0,
                'total_lessons' => 0,
                'time_spent_minutes' => 0,
                'modules_completed' => 0,
                'total_modules' => 0,
                'average_quiz_score' => 0,
                'completion_rate' => 0,
                'learning_streak_days' => 0,
                'last_activity' => null
            ];
        }
        
        // Get module completion stats
        $totalModules = Module::where('language', $language)
            ->where('is_published', true)
            ->count();
            
        $completedModules = $this->getCompletedModulesCount($user, $language);
        
        // Get average quiz score
        $avgQuizScore = $user->lessonProgress()
            ->whereHas('lesson', function ($query) use ($language) {
                $query->where('language', $language);
            })
            ->whereNotNull('quiz_score')
            ->avg('quiz_score') ?? 0;
            
        // Get learning streak
        $learningStreak = $this->calculateLearningStreak($user, $language);
        
        // Get last activity
        $lastActivity = $user->lessonProgress()
            ->whereHas('lesson', function ($query) use ($language) {
                $query->where('language', $language);
            })
            ->latest('updated_at')
            ->first()?->updated_at;
            
        return [
            'overall_progress' => $progress->progress_percentage,
            'completed_lessons' => $progress->completed_lessons,
            'total_lessons' => $progress->total_lessons,
            'time_spent_minutes' => $progress->time_spent_minutes,
            'modules_completed' => $completedModules,
            'total_modules' => $totalModules,
            'average_quiz_score' => round($avgQuizScore, 1),
            'completion_rate' => $progress->total_lessons > 0 ? 
                round(($progress->completed_lessons / $progress->total_lessons) * 100, 1) : 0,
            'learning_streak_days' => $learningStreak,
            'last_activity' => $lastActivity?->format('Y-m-d H:i:s'),
            'started_at' => $progress->started_at?->format('Y-m-d H:i:s'),
            'completed_at' => $progress->completed_at?->format('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Legacy method for compatibility with event listeners.
     * In a single-course setup, this delegates to updateUserProgress.
     */
    public function updateCourseProgress(User $user, $course = null): void
    {
        // In a single-course scenario, just update the user's progress
        $this->updateUserProgress($user);
    }
    
    /**
     * Get the number of completed modules for a user.
     */
    private function getCompletedModulesCount(User $user, string $language): int
    {
        return Module::where('language', $language)
            ->where('is_published', true)
            ->whereHas('lessons', function ($query) use ($user, $language) {
                $query->where('language', $language)
                      ->where('is_published', true);
            })
            ->get()
            ->filter(function ($module) use ($user, $language) {
                // Check if all lessons in this module are completed
                $totalLessons = $module->lessons()
                    ->where('language', $language)
                    ->where('is_published', true)
                    ->count();
                    
                $completedLessons = $user->lessonProgress()
                    ->whereHas('lesson', function ($query) use ($module, $language) {
                        $query->where('module_id', $module->id)
                              ->where('language', $language)
                              ->where('is_published', true);
                    })
                    ->where('is_completed', true)
                    ->count();
                    
                return $totalLessons > 0 && $completedLessons >= $totalLessons;
            })
            ->count();
    }
    
    /**
     * Calculate the user's learning streak in days.
     */
    private function calculateLearningStreak(User $user, string $language): int
    {
        $lessonCompletions = $user->lessonProgress()
            ->whereHas('lesson', function ($query) use ($language) {
                $query->where('language', $language);
            })
            ->where('is_completed', true)
            ->orderBy('completed_at', 'desc')
            ->pluck('completed_at')
            ->map(function ($date) {
                return $date->format('Y-m-d');
            })
            ->unique()
            ->values();
            
        if ($lessonCompletions->isEmpty()) {
            return 0;
        }
        
        $streak = 1;
        $currentDate = now()->format('Y-m-d');
        $lastCompletionDate = $lessonCompletions->first();
        
        // If last completion was not today or yesterday, streak is broken
        if ($lastCompletionDate !== $currentDate && 
            $lastCompletionDate !== now()->subDay()->format('Y-m-d')) {
            return 0;
        }
        
        // Count consecutive days
        for ($i = 1; $i < $lessonCompletions->count(); $i++) {
            $currentCompletion = \Carbon\Carbon::parse($lessonCompletions[$i - 1]);
            $previousCompletion = \Carbon\Carbon::parse($lessonCompletions[$i]);
            
            if ($currentCompletion->diffInDays($previousCompletion) === 1) {
                $streak++;
            } else {
                break;
            }
        }
        
        return $streak;
    }
}
