<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LessonPolicy
{
    /**
     * Determine whether the user can view any lessons.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the lesson.
     */
    public function view(User $user, Lesson $lesson): bool
    {
        // Simple auth check - if user is logged in, they can view any published lesson
        return $user && $lesson->is_published;
    }

    /**
     * Determine whether the user can create lessons.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can update the lesson.
     */
    public function update(User $user, Lesson $lesson): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can delete the lesson.
     */
    public function delete(User $user, Lesson $lesson): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can restore the lesson.
     */
    public function restore(User $user, Lesson $lesson): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the lesson.
     */
    public function forceDelete(User $user, Lesson $lesson): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can access lesson content.
     */
    public function access(User $user, Lesson $lesson): bool
    {
        // Simple auth check - if user is logged in, they can access any published lesson
        return $user && $lesson->is_published;
    }

    /**
     * Determine whether the user can mark lesson as completed.
     */
    public function complete(User $user, Lesson $lesson): bool
    {
        return $this->access($user, $lesson);
    }

    /**
     * Determine whether the user can view lesson video.
     */
    public function viewVideo(User $user, Lesson $lesson): bool
    {
        return $this->access($user, $lesson);
    }

    /**
     * Determine whether the user can upload lesson video.
     */
    public function uploadVideo(User $user, Lesson $lesson): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can view lesson progress.
     */
    public function viewProgress(User $user, Lesson $lesson): bool
    {
        // Users can view their own progress, admins and instructors can view all progress
        return $user->role === 'admin' || 
               $user->role === 'instructor' ||
               $this->access($user, $lesson);
    }

    /**
     * Determine whether the user can take lesson quiz.
     */
    public function takeQuiz(User $user, Lesson $lesson): bool
    {
        return $this->access($user, $lesson) && $lesson->has_quiz;
    }

    /**
     * Determine whether the user can view lesson resources.
     */
    public function viewResources(User $user, Lesson $lesson): bool
    {
        return $this->access($user, $lesson);
    }

    /**
     * Check if user has completed prerequisites for the lesson.
     */
    public function checkPrerequisites(User $user, Lesson $lesson): bool
    {
        // Admin and instructors bypass prerequisites
        if ($user->role === 'admin' || $user->role === 'instructor') {
            return true;
        }

        // Get all lessons in the same module that come before this lesson
        $previousLessons = Lesson::where('module_id', $lesson->module_id)
            ->where('order', '<', $lesson->order)
            ->where('is_published', true)
            ->pluck('id');

        if ($previousLessons->isEmpty()) {
            return true; // No prerequisites
        }

        // Check if user has completed all previous lessons
        $completedLessons = $user->lessonProgress()
            ->whereIn('lesson_id', $previousLessons)
            ->where('is_completed', true)
            ->count();

        return $completedLessons === $previousLessons->count();
    }

    /**
     * Determine whether the user can skip prerequisites.
     */
    public function skipPrerequisites(User $user, Lesson $lesson): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }
}