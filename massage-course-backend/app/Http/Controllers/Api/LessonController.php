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
use Illuminate\Support\Facades\DB;

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
        // User is already authenticated via middleware, no additional authorization needed

        $lesson->load('module');
        
        // Update last accessed lesson for the user
        $user = $request->user();
        if ($user) {
            $progress = $user->progress;
            if ($progress) {
                $progress->updateLastLesson($lesson);
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
        
        // User is already authenticated via middleware, no additional authorization needed

        $progressData = $request->validated();
        
        $lessonProgress = LessonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id
            ],
            $progressData
        );

        // Update overall course progress
        $this->progressService->updateUserProgress($user);

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
        
        // User is already authenticated via middleware, no additional authorization needed

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

        // Update overall progress
        $this->progressService->updateUserProgress($user);

        // Check if course is now completed
        $userProgress = $user->progress;
        $courseCompleted = $userProgress && $userProgress->is_completed;

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
        
        // User is already authenticated via middleware, no additional authorization needed

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

        // Mark as completed if score is above passing threshold (70%)
        if ($score >= 70) {
            $lessonProgress->markAsCompleted();
            $this->progressService->updateUserProgress($user);
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
        
        // User is already authenticated via middleware, no additional authorization needed

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
        
        // User is already authenticated via middleware, no additional authorization needed

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