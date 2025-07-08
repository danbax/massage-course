<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->use([
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
        
        $middleware->api(append: [
            \App\Http\Middleware\ValidateJsonPayload::class,
            \App\Http\Middleware\ForceJsonResponse::class,
            \App\Http\Middleware\ApiSecurityHeaders::class,
            'throttle:api',
        ]);

        // Register middleware aliases
        $middleware->alias([
            'api_auth' => \App\Http\Middleware\ApiAuthentication::class,
            'course.access' => \App\Http\Middleware\CourseAccess::class,
            'lesson.access' => \App\Http\Middleware\LessonAccess::class,
            'admin.only' => \App\Http\Middleware\AdminOnly::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Not Found.'
                ], 404);
            }
        });
        
        $exceptions->render(function (\Illuminate\Http\Exceptions\HttpResponseException $e, $request) {
            if ($request->is('api/*') && $e->getResponse()->getStatusCode() === 422) {
                $response = $e->getResponse();
                $content = json_decode($response->getContent(), true);
                return response()->json([
                    'message' => $content['message'] ?? 'Validation failed',
                    'errors' => $content['errors'] ?? []
                ], 422);
            }
        });
        
        $exceptions->render(function (\Exception $e, $request) {
            if ($request->is('api/*') && str_contains($e->getMessage(), 'Syntax error')) {
                return response()->json([
                    'message' => 'Invalid JSON format'
                ], 400);
            }
        });
    })->create();
