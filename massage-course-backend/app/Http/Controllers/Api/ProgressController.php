<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgressResource;
use App\Models\Lesson;
use App\Services\ProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function __construct(
        private ProgressService $progressService
    ) {}

    /**
     * Get user's overall progress for the single course.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $userLanguage = $user->language ?? 'en';
        
        $progress = $user->progress;
        
        if (!$progress) {
            // Create initial progress record
            $totalLessons = Lesson::where('language', $userLanguage)
                ->where('is_published', true)
                ->count();
                
            $progress = $user->progress()->create([
                'completed_lessons' => 0,
                'total_lessons' => $totalLessons,
                'progress_percentage' => 0,
                'time_spent_minutes' => 0
            ]);
        }

        return response()->json([
            'progress' => new ProgressResource($progress)
        ]);
    }

    /**
     * Get detailed analytics for the user.
     */
    public function analytics(Request $request): JsonResponse
    {
        $user = $request->user();
        $userLanguage = $user->language ?? 'en';
        
        $analytics = $this->progressService->getUserProgressAnalytics($user, $userLanguage);

        return response()->json([
            'analytics' => $analytics
        ]);
    }

    /**
     * Get detailed course progress with lessons.
     */
    public function courseProgress(Request $request): JsonResponse
    {
        $user = $request->user();
        $userLanguage = $user->language ?? 'en';
        
        $progress = $user->progress;
        
        if (!$progress) {
            return response()->json([
                'message' => 'Progress not found'
            ], 404);
        }

        // Get lesson-by-lesson progress
        $lessonProgress = $user->lessonProgress()
            ->whereHas('lesson', function ($query) use ($userLanguage) {
                $query->where('language', $userLanguage);
            })
            ->with('lesson')
            ->get()
            ->keyBy('lesson_id');

        // Get modules with lessons
        $modules = \App\Models\Module::where('language', $userLanguage)
            ->published()
            ->with(['lessons' => function ($query) use ($userLanguage) {
                $query->published()
                      ->where('language', $userLanguage)
                      ->orderBy('order');
            }])
            ->orderBy('order')
            ->get();

        // Add progress data to each lesson
        foreach ($modules as $module) {
            foreach ($module->lessons as $lesson) {
                $lesson->progress = $lessonProgress->get($lesson->id);
            }
        }

        return response()->json([
            'course_progress' => new ProgressResource($progress),
            'modules' => $modules,
            'completion_timeline' => $this->getCompletionTimeline($user, $userLanguage)
        ]);
    }

    /**
     * Get progress for a specific lesson.
     */
    public function lessonProgress(Lesson $lesson, Request $request): JsonResponse
    {
        $user = $request->user();

        $progress = $lesson->getProgressForUser($user);

        return response()->json([
            'lesson_progress' => $progress,
            'lesson' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'duration_minutes' => $lesson->duration_minutes,
                'has_quiz' => $lesson->has_quiz
            ]
        ]);
    }

    /**
     * Reset user progress.
     */
    public function reset(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $this->authorize('reset', $user->progress);
        
        // Reset lesson progress
        $user->lessonProgress()->delete();
        
        // Reset overall progress
        if ($user->progress) {
            $userLanguage = $user->language ?? 'en';
            $totalLessons = Lesson::where('language', $userLanguage)
                ->where('is_published', true)
                ->count();
                
            $user->progress->update([
                'completed_lessons' => 0,
                'total_lessons' => $totalLessons,
                'progress_percentage' => 0,
                'last_lesson_id' => null,
                'time_spent_minutes' => 0,
                'started_at' => null,
                'completed_at' => null
            ]);
        }

        return response()->json([
            'message' => 'Progress reset successfully'
        ]);
    }

    /**
     * Get completion timeline for the course.
     */
    private function getCompletionTimeline($user, string $language): array
    {
        $completedLessons = $user->lessonProgress()
            ->whereHas('lesson', function ($query) use ($language) {
                $query->where('language', $language);
            })
            ->where('is_completed', true)
            ->with('lesson')
            ->orderBy('completed_at')
            ->get();

        return $completedLessons->map(function ($progress) {
            return [
                'lesson_id' => $progress->lesson_id,
                'lesson_title' => $progress->lesson->title,
                'completed_at' => $progress->completed_at->format('Y-m-d H:i:s'),
                'watch_time_seconds' => $progress->watch_time_seconds,
                'quiz_score' => $progress->quiz_score
            ];
        })->toArray();
    }
}