<?php

namespace App\Listeners;

use App\Events\LessonCompleted;
use App\Services\ProgressService;
use Illuminate\Support\Facades\Log;

class UpdateCourseProgress
{
    public function __construct(
        private ProgressService $progressService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(LessonCompleted $event): void
    {
        try {
            // Update the overall course progress
            $this->progressService->updateCourseProgress(
                $event->user,
                $event->lesson->module->course
            );
            
            Log::info('Course progress updated successfully', [
                'user_id' => $event->user->id,
                'lesson_id' => $event->lesson->id,
                'course_id' => $event->lesson->module->course->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update course progress', [
                'user_id' => $event->user->id,
                'lesson_id' => $event->lesson->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
