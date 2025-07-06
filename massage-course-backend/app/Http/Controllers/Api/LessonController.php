<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lesson\UpdateProgressRequest;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Services\ProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function __construct(
        private ProgressService $progressService
    ) {}

    /**
     * Display the specified lesson.
     */
    public function show(Lesson $lesson, Request $request): JsonResponse
    {
        $this->authorize('view', $lesson);

        $lesson->load('module.course');
        
        // Update last accessed for enrolled users
        if ($request->user() && $request->user()->isEnrolledIn($lesson->module->course)) {
            $enrollment = $request->user()->courseEnrollments()
                ->where('course_id', $lesson->module->course->id)
                ->first();
            
            if ($enrollment) {
                $enrollment->updateLastAccessed();
            }
        }

        return response()->json([
            'lesson' => new LessonResource($lesson)
        ]);
    }

    /**
     * Update lesson progress for the authenticated user.
     */
    public function updateProgress(Lesson $lesson, UpdateProgressRequest $request): JsonResponse
    {
        $user = $request->user();
        
        // Check if user has access to this lesson
        $this->authorize('view', $lesson);

        $progressData = $request->validated();
        
        $lessonProgress = LessonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id
            ],
            $progressData
        );

        // Update overall course progress
        $this->progressService->updateCourseProgress($user, $lesson->module->course);

        return response()->json([
            'message' => 'Progress updated successfully',
            'progress' => $lessonProgress
        ]);
    }

    /**
     * Mark lesson as completed.
     */
    public function markCompleted(Lesson $lesson, Request $request): JsonResponse
    {
        $user = $request->user();
        
        $this->authorize('view', $lesson);

        $lessonProgress = LessonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id
            ],
            [
                'is_completed' => true,
                'completed_at' => now(),
                'watch_percentage' => 100.00
            ]
        );

        // Update overall course progress
        $this->progressService->updateCourseProgress($user, $lesson->module->course);

        // Check if course is now completed
        $courseProgress = $user->getProgressForCourse($lesson->module->course);
        $courseCompleted = $courseProgress && $courseProgress->is_completed;

        return response()->json([
            'message' => 'Lesson marked as completed',
            'lesson_progress' => $lessonProgress,
            'course_completed' => $courseCompleted
        ]);
    }

    /**
     * Submit quiz answers for a lesson.
     */
    public function submitQuiz(Lesson $lesson, Request $request): JsonResponse
    {
        $user = $request->user();
        
        $this->authorize('view', $lesson);

        $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required'
        ]);

        if (!$lesson->has_quiz) {
            return response()->json([
                'message' => 'This lesson does not have a quiz'
            ], 400);
        }

        // Calculate quiz score
        $score = $this->calculateQuizScore($lesson->quiz_questions, $request->answers);

        $lessonProgress = LessonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id
            ],
            [
                'quiz_score' => $score,
                'quiz_attempts' => DB::raw('quiz_attempts + 1')
            ]
        );

        // Mark as completed if score is above passing threshold (e.g., 70%)
        if ($score >= 70) {
            $lessonProgress->markAsCompleted();
            $this->progressService->updateCourseProgress($user, $lesson->module->course);
        }

        return response()->json([
            'message' => 'Quiz submitted successfully',
            'score' => $score,
            'passed' => $score >= 70,
            'lesson_progress' => $lessonProgress
        ]);
    }

    /**
     * Get lesson notes for the authenticated user.
     */
    public function getNotes(Lesson $lesson, Request $request): JsonResponse
    {
        $user = $request->user();
        
        $this->authorize('view', $lesson);

        $progress = LessonProgress::where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->first();

        return response()->json([
            'notes' => $progress ? $progress->notes : ''
        ]);
    }

    /**
     * Update lesson notes for the authenticated user.
     */
    public function updateNotes(Lesson $lesson, Request $request): JsonResponse
    {
        $user = $request->user();
        
        $this->authorize('view', $lesson);

        $request->validate([
            'notes' => 'nullable|string|max:5000'
        ]);

        $progress = LessonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id
            ],
            [
                'notes' => $request->notes
            ]
        );

        return response()->json([
            'message' => 'Notes updated successfully',
            'notes' => $progress->notes
        ]);
    }

    /**
     * Calculate quiz score based on correct answers.
     */
    private function calculateQuizScore(array $questions, array $answers): float
    {
        $totalQuestions = count($questions);
        $correctAnswers = 0;

        foreach ($questions as $index => $question) {
            $userAnswer = $answers[$index] ?? null;
            $correctAnswer = $question['correct_answer'] ?? null;

            if ($userAnswer === $correctAnswer) {
                $correctAnswers++;
            }
        }

        return $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 100 : 0;
    }
}
