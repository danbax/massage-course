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
        return true; // All authenticated users can view lessons
    }

    /**
     * Determine whether the user can view the lesson.
     */
    public function view(User $user, Lesson $lesson): bool
    {
        // Check if user is enrolled in the course
        return $user->enrolledCourses()
            ->where('course_id', $lesson->module->course_id)
            ->exists() || $user->role === 'admin';
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
        return $user->role === 'admin' || 
               ($user->role === 'instructor' && $lesson->module->course->instructor_id === $user->id);
    }

    /**
     * Determine whether the user can delete the lesson.
     */
    public function delete(User $user, Lesson $lesson): bool
    {
        return $user->role === 'admin' || 
               ($user->role === 'instructor' && $lesson->module->course->instructor_id === $user->id);
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
        // Admin can access any lesson
        if ($user->role === 'admin') {
            return true;
        }

        // Check if user is enrolled in the course
        if (!$user->enrolledCourses()->where('course_id', $lesson->module->course_id)->exists()) {
            return false;
        }

        // Check prerequisites
        return $this->checkPrerequisites($user, $lesson);
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
        return $user->role === 'admin' || 
               ($user->role === 'instructor' && $lesson->module->course->instructor_id === $user->id);
    }

    /**
     * Determine whether the user can view lesson progress.
     */
    public function viewProgress(User $user, Lesson $lesson): bool
    {
        // Users can view their own progress, admins and instructors can view all progress
        return $user->role === 'admin' || 
               ($user->role === 'instructor' && $lesson->module->course->instructor_id === $user->id) ||
               $this->access($user, $lesson);
    }

    /**
     * Check if user has completed prerequisites for the lesson
     */
    private function checkPrerequisites(User $user, Lesson $lesson): bool
    {
        // Get all lessons in the same module that come before this lesson
        $previousLessons = Lesson::where('module_id', $lesson->module_id)
            ->where('order', '<', $lesson->order)
            ->pluck('id');

        if ($previousLessons->isEmpty()) {
            return true; // No prerequisites
        }

        // Check if user has completed all previous lessons
        $completedLessons = $user->lessonProgress()
            ->whereIn('lesson_id', $previousLessons)
            ->where('completed', true)
            ->count();

        return $completedLessons === $previousLessons->count();
    }
}
