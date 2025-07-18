<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ContentSecurityPolicy
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $csp = "style-src 'self' 'unsafe-inline' https://allpay.to https://fonts.googleapis.com; ";
        $csp .= "font-src 'self' https://fonts.gstatic.com; ";
        $csp .= "frame-src 'self' https://allpay.to;";

        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
