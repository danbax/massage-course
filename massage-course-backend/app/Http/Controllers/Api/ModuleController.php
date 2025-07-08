<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Get all modules with their lessons for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $userLanguage = $user->language ?? 'en';
        
        // Get all published modules with their lessons filtered by user's language
        $modules = Module::published()
            ->where('language', $userLanguage)
            ->with([
                'lessons' => function($query) use ($userLanguage) {
                    $query->published()
                          ->where('language', $userLanguage)
                          ->orderBy('order');
                }
            ])
            ->orderBy('order')
            ->get();

        // Add progress information for each lesson
        $modules->transform(function($module) use ($user) {
            $module->lessons->transform(function($lesson) use ($user) {
                $progress = $user->lessonProgress()
                    ->where('lesson_id', $lesson->id)
                    ->first();
                
                $lesson->progress = [
                    'is_completed' => $progress ? $progress->is_completed : false,
                    'watch_percentage' => $progress ? $progress->watch_percentage : 0,
                    'time_spent_minutes' => $progress ? $progress->watch_time_seconds / 60 : 0,
                    'last_accessed_at' => $progress ? $progress->updated_at : null,
                    'quiz_score' => $progress ? $progress->quiz_score : null,
                    'quiz_attempts' => $progress ? $progress->quiz_attempts : 0
                ];
                
                return $lesson;
            });
            
            return $module;
        });

        // Get user's overall progress
        $userProgress = $user->progress;
        
        return response()->json([
            'modules' => $modules,
            'progress' => [
                'completed_lessons' => $userProgress ? $userProgress->completed_lessons : 0,
                'total_lessons' => $userProgress ? $userProgress->total_lessons : 
                    Lesson::where('language', $userLanguage)->published()->count(),
                'progress_percentage' => $userProgress ? $userProgress->progress_percentage : 0,
                'time_spent_minutes' => $userProgress ? $userProgress->time_spent_minutes : 0,
                'is_completed' => $userProgress ? $userProgress->is_completed : false,
                'started_at' => $userProgress ? $userProgress->started_at : null,
                'completed_at' => $userProgress ? $userProgress->completed_at : null
            ]
        ]);
    }

    /**
     * Get a specific module with its lessons.
     */
    public function show(Module $module, Request $request): JsonResponse
    {
        $user = $request->user();
        $userLanguage = $user->language ?? 'en';
        
        $this->authorize('view', $module);
        
        // Ensure the module is in the user's language
        if ($module->language !== $userLanguage) {
            return response()->json(['message' => 'Module not found'], 404);
        }
        
        // Load lessons with progress, filtered by language
        $module->load([
            'lessons' => function($query) use ($userLanguage) {
                $query->published()
                      ->where('language', $userLanguage)
                      ->orderBy('order');
            }
        ]);

        // Add progress information for each lesson
        $module->lessons->transform(function($lesson) use ($user) {
            $progress = $user->lessonProgress()
                ->where('lesson_id', $lesson->id)
                ->first();
            
            $lesson->progress = [
                'is_completed' => $progress ? $progress->is_completed : false,
                'watch_percentage' => $progress ? $progress->watch_percentage : 0,
                'time_spent_minutes' => $progress ? $progress->watch_time_seconds / 60 : 0,
                'last_accessed_at' => $progress ? $progress->updated_at : null,
                'quiz_score' => $progress ? $progress->quiz_score : null,
                'quiz_attempts' => $progress ? $progress->quiz_attempts : 0
            ];
            
            return $lesson;
        });

        return response()->json([
            'module' => $module
        ]);
    }
}