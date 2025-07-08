<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Lesson;
use Symfony\Component\HttpFoundation\Response;

class LessonAccess
{
    /**
     * Handle an incoming request for single course system.
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

        // Get the lesson with its module
        $lesson = Lesson::with('module')->find($lessonId);

        if (!$lesson) {
            return response()->json([
                'message' => 'Lesson not found',
                'error' => 'Not found'
            ], 404);
        }

        // Check if lesson is published
        if (!$lesson->is_published && !in_array($user->role, ['admin', 'instructor'])) {
            return response()->json([
                'message' => 'Lesson not available',
                'error' => 'Access denied'
            ], 403);
        }

        // Admin and instructors have full access
        if (in_array($user->role, ['admin', 'instructor'])) {
            return $next($request);
        }

        // Check if lesson is free or user has paid
        if (!$lesson->is_free) {
            $hasAccess = $user->payments()->where('status', 'succeeded')->exists();
            
            if (!$hasAccess) {
                return response()->json([
                    'message' => 'This lesson requires course purchase',
                    'error' => 'Payment required',
                    'lesson_id' => $lesson->id,
                    'is_free' => false
                ], 402);
            }
        }

        // Check language compatibility
        $userLanguage = $user->language ?? 'en';
        if ($lesson->language !== $userLanguage) {
            return response()->json([
                'message' => 'Lesson not available in your language',
                'error' => 'Language mismatch'
            ], 404);
        }

        // Add lesson to request for use in controllers
        $request->merge(['lesson' => $lesson]);

        return $next($request);
    }
}