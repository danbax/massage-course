<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CourseAccess
{
    /**
     * Handle an incoming request - for single course system.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication required',
                'error' => 'Unauthenticated'
            ], 401);
        }

        // In single course system, check if user has paid for course access
        // Admin and instructors have automatic access
        if ($user->role === 'admin' || $user->role === 'instructor') {
            return $next($request);
        }

        // Check if user has made a successful payment for course access
        $hasAccess = $user->payments()->where('status', 'succeeded')->exists();

        if (!$hasAccess) {
            return response()->json([
                'message' => 'Course access requires payment',
                'error' => 'Payment required',
                'payment_required' => true
            ], 402); // Payment Required
        }

        return $next($request);
    }
}