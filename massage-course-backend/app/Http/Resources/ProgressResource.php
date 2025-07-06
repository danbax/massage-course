<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'course_id' => $this->course_id,
            'completed_lessons' => $this->completed_lessons,
            'total_lessons' => $this->total_lessons,
            'progress_percentage' => $this->progress_percentage,
            'time_spent_minutes' => $this->time_spent_minutes,
            'formatted_time_spent' => $this->formatted_time_spent,
            'is_completed' => $this->is_completed,
            'started_at' => $this->started_at?->format('Y-m-d H:i:s'),
            'completed_at' => $this->completed_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Include related data when loaded
            'course' => new CourseResource($this->whenLoaded('course')),
            'user' => new UserResource($this->whenLoaded('user')),
            'last_lesson' => new LessonResource($this->whenLoaded('lastLesson')),
        ];
    }
}
