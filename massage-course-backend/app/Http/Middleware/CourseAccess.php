<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\CourseEnrollment;
use Symfony\Component\HttpFoundation\Response;

class CourseAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $courseId = $request->route('course') ?? $request->route('id');

        if (!$user) {
            return response()->json([
                'message' => 'Authentication required',
                'error' => 'Unauthenticated'
            ], 401);
        }

        // Check if user is enrolled in the course
        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'message' => 'You are not enrolled in this course',
                'error' => 'Course access denied'
            ], 403);
        }

        // Add enrollment to request for use in controllers
        $request->merge(['enrollment' => $enrollment]);

        return $next($request);
    }
}
