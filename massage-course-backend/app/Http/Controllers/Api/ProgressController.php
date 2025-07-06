<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgressResource;
use App\Models\Course;
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
     * Get user's overall progress across all courses.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $courseProgress = $user->courseProgress()
            ->with(['course', 'lastLesson'])
            ->orderBy('updated_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'progress' => ProgressResource::collection($courseProgress->items()),
            'meta' => [
                'current_page' => $courseProgress->currentPage(),
                'last_page' => $courseProgress->lastPage(),
                'per_page' => $courseProgress->perPage(),
                'total' => $courseProgress->total()
            ]
        ]);
    }

    /**
     * Get detailed analytics for the user.
     */
    public function analytics(Request $request): JsonResponse
    {
        $user = $request->user();
        $analytics = $this->progressService->getUserProgressAnalytics($user);

        return response()->json(['analytics' => $analytics]);
    }

    /**
     * Get progress for a specific course.
     */
    public function courseProgress(Course $course, Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isEnrolledIn($course)) {
            return response()->json([
                'message' => 'Not enrolled in this course'
            ], 403);
        }

        $progress = $user->getProgressForCourse($course);
        
        if (!$progress) {
            return response()->json([
                'message' => 'Progress not found'
            ], 404);
        }

        // Get lesson-by-lesson progress
        $lessonProgress = $user->lessonProgress()
            ->whereHas('lesson.module', function ($query) use ($course) {
                $query->where('course_id', $course->id);
            })
            ->with('lesson')
            ->get()
            ->keyBy('lesson_id');

        $courseWithLessons = $course->load(['modules.lessons' => function ($query) {
            $query->published()->ordered();
        }]);

        // Add progress data to each lesson
        foreach ($courseWithLessons->modules as $module) {
            foreach ($module->lessons as $lesson) {
                $lesson->progress = $lessonProgress->get($lesson->id);
            }
        }

        return response()->json([
            'course_progress' => new ProgressResource($progress),
            'course' => $courseWithLessons,
            'completion_timeline' => $this->getCompletionTimeline($user, $course)
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
     * Get completion timeline for a course.
     */
    private function getCompletionTimeline($user, Course $course): array
    {
        $completedLessons = $user->lessonProgress()
            ->whereHas('lesson.module', function ($query) use ($course) {
                $query->where('course_id', $course->id);
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
