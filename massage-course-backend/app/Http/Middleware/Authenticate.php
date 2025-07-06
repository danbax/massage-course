<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        return $request->expectsJson() ? null : route('login');
    }

    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, ...$guards)
    {
        if ($request->expectsJson() && !$request->bearerToken()) {
            return response()->json([
                'message' => 'Authentication token is required',
                'error' => 'Unauthenticated'
            ], 401);
        }

        $this->authenticate($request, $guards);

        return $next($request);
    }
}
