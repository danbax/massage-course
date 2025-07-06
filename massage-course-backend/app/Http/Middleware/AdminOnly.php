<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    /**
     * Handle an incoming request.
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

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Admin access required',
                'error' => 'Insufficient permissions'
            ], 403);
        }

        return $next($request);
    }
}
