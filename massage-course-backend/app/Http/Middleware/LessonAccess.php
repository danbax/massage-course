<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\CourseEnrollment;
use Symfony\Component\HttpFoundation\Response;

class LessonAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $lessonId = $request->route('lesson') ?? $request->route('id');

        if (!$user) {
            return response()->json([
                'message' => 'Authentication required',
                'error' => 'Unauthenticated'
            ], 401);
        }

        // Get the lesson with its module and course
        $lesson = Lesson::with('module.course')->find($lessonId);

        if (!$lesson) {
            return response()->json([
                'message' => 'Lesson not found',
                'error' => 'Not found'
            ], 404);
        }

        // Check if user is enrolled in the course
        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $lesson->module->course_id)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'message' => 'You are not enrolled in this course',
                'error' => 'Lesson access denied'
            ], 403);
        }

        // Check if lesson prerequisites are met
        if (!$this->checkPrerequisites($user, $lesson)) {
            return response()->json([
                'message' => 'Prerequisites not met for this lesson',
                'error' => 'Prerequisites required'
            ], 403);
        }

        // Add lesson and enrollment to request for use in controllers
        $request->merge([
            'lesson' => $lesson,
            'enrollment' => $enrollment
        ]);

        return $next($request);
    }

    /**
     * Check if user has completed prerequisites for the lesson
     */
    private function checkPrerequisites($user, $lesson): bool
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
