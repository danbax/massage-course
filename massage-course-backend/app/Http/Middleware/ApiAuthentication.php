<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\PersonalAccessToken;

class ApiAuthentication
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                'message' => 'Authentication token is required',
                'error' => 'Unauthenticated'
            ], 401);
        }

        // Find the personal access token
        $accessToken = PersonalAccessToken::findToken($token);
        
        if (!$accessToken) {
            return response()->json([
                'message' => 'Invalid or expired token',
                'error' => 'Unauthenticated'
            ], 401);
        }

        // Check if token is expired (if expiration is set)
        if ($accessToken->expires_at && $accessToken->expires_at->isPast()) {
            return response()->json([
                'message' => 'Token has expired',
                'error' => 'Unauthenticated'
            ], 401);
        }

        // Set the authenticated user for this request
        $request->setUserResolver(function () use ($accessToken) {
            return $accessToken->tokenable;
        });

        return $next($request);
    }
}