<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $progress = null;
        
        if ($user) {
            $progress = $this->getProgressForUser($user);
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'content' => $this->content,
            'video_url' => $this->when($this->canAccessVideo($user), $this->video_url),
            'video_duration_seconds' => $this->video_duration_seconds,
            'duration_minutes' => $this->duration_minutes,
            'formatted_duration' => $this->formatted_duration,
            'thumbnail' => $this->thumbnail ? asset('storage/lessons/' . $this->thumbnail) : null,
            'sort_order' => $this->sort_order,
            'is_published' => $this->is_published,
            'is_preview' => $this->is_preview,
            'has_video' => $this->has_video,
            'has_quiz' => $this->has_quiz,
            'resources' => $this->resources,
            'quiz_questions' => $this->when($this->canAccessQuiz($user), $this->quiz_questions),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // User-specific progress data
            'user_progress' => [
                'is_completed' => $progress ? $progress->is_completed : false,
                'watch_percentage' => $progress ? $progress->watch_percentage : 0,
                'watch_time_seconds' => $progress ? $progress->watch_time_seconds : 0,
                'quiz_score' => $progress ? $progress->quiz_score : null,
                'quiz_attempts' => $progress ? $progress->quiz_attempts : 0,
                'completed_at' => $progress && $progress->completed_at ? $progress->completed_at->format('Y-m-d H:i:s') : null,
            ],
        ];
    }

    /**
     * Check if user can access video content.
     */
    private function canAccessVideo($user): bool
    {
        // Allow access if lesson is preview or user is enrolled
        if ($this->is_preview) {
            return true;
        }

        if (!$user) {
            return false;
        }

        // Check if user is enrolled in the course
        $course = $this->module->course;
        return $user->isEnrolledIn($course);
    }

    /**
     * Check if user can access quiz content.
     */
    private function canAccessQuiz($user): bool
    {
        return $this->canAccessVideo($user);
    }
}
