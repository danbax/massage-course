<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CoursePolicy
{
    /**
     * Determine whether the user can view any courses.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view courses
    }

    /**
     * Determine whether the user can view the course.
     */
    public function view(User $user, Course $course): bool
    {
        // Users can view published courses or courses they're enrolled in
        return $course->is_published || $user->enrolledCourses()->where('course_id', $course->id)->exists();
    }

    /**
     * Determine whether the user can create courses.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can update the course.
     */
    public function update(User $user, Course $course): bool
    {
        return $user->role === 'admin' || 
               ($user->role === 'instructor' && $course->instructor_id === $user->id);
    }

    /**
     * Determine whether the user can delete the course.
     */
    public function delete(User $user, Course $course): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the course.
     */
    public function restore(User $user, Course $course): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the course.
     */
    public function forceDelete(User $user, Course $course): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can enroll in the course.
     */
    public function enroll(User $user, Course $course): bool
    {
        // Check if course is published and user is not already enrolled
        return $course->is_published && 
               !$user->enrolledCourses()->where('course_id', $course->id)->exists();
    }

    /**
     * Determine whether the user can access course content.
     */
    public function access(User $user, Course $course): bool
    {
        // Admin can access any course, users need to be enrolled
        return $user->role === 'admin' || 
               $user->enrolledCourses()->where('course_id', $course->id)->exists();
    }

    /**
     * Determine whether the user can manage course enrollments.
     */
    public function manageEnrollments(User $user, Course $course): bool
    {
        return $user->role === 'admin' || 
               ($user->role === 'instructor' && $course->instructor_id === $user->id);
    }

    /**
     * Determine whether the user can publish/unpublish the course.
     */
    public function publish(User $user, Course $course): bool
    {
        return $user->role === 'admin' || 
               ($user->role === 'instructor' && $course->instructor_id === $user->id);
    }

    /**
     * Determine whether the user can view course analytics.
     */
    public function viewAnalytics(User $user, Course $course): bool
    {
        return $user->role === 'admin' || 
               ($user->role === 'instructor' && $course->instructor_id === $user->id);
    }
}
