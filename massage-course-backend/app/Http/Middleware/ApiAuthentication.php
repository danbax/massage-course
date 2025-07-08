<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAuthentication
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->bearerToken()) {
            return response()->json([
                'message' => 'Authentication token is required',
                'error' => 'Unauthenticated'
            ], 401);
        }

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid or expired token',
                'error' => 'Unauthenticated'
            ], 401);
        }

        return $next($request);
    }
}