<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Force JSON response for API routes
        if ($request->is('api/*')) {
            $request->headers->set('Accept', 'application/json');
        }
        
        $response = $next($request);
        
        // Handle CORS preflight
        if ($request->getMethod() === 'OPTIONS') {
            $response = response()->json([], 200);
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            return $response;
        }
        
        return $response;
    }
}
