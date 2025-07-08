<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAuthentication
{
    public function handle(Request $request, Closure $next): Response
    {
        // Use the 'api' guard which is configured to use Sanctum
        if (!auth('api')->check()) {
            return response()->json([
                'message' => 'Unauthenticated',
                'error' => 'Authentication token is required or invalid'
            ], 401);
        }

        return $next($request);
    }
}