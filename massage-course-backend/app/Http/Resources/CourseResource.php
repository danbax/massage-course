<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail ? asset('storage/courses/' . $this->thumbnail) : null,
            'price' => $this->price,
            'formatted_price' => $this->is_free ? 'Free' : '$' . number_format($this->price, 2),
            'is_free' => $this->is_free,
            'duration_hours' => $this->duration_hours,
            'difficulty_level' => $this->difficulty_level,
            'instructor' => [
                'name' => $this->instructor_name,
                'bio' => $this->instructor_bio,
                'avatar' => $this->instructor_avatar ? asset('storage/instructors/' . $this->instructor_avatar) : null,
            ],
            'learning_objectives' => $this->learning_objectives,
            'prerequisites' => $this->prerequisites,
            'total_lessons' => $this->total_lessons,
            'total_duration' => $this->total_duration,
            'enrolled_students_count' => $this->enrolled_students_count,
            'average_rating' => $this->average_rating,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Include modules and lessons when loaded
            'modules' => ModuleResource::collection($this->whenLoaded('modules')),
            
            // Additional computed fields
            'slug' => str($this->title)->slug(),
            'completion_rate' => $this->getCompletionRate(),
            'can_preview' => $this->hasPreviewLessons(),
        ];
    }

    /**
     * Get the completion rate for this course.
     */
    private function getCompletionRate(): float
    {
        $totalEnrollments = $this->enrollments()->count();
        
        if ($totalEnrollments === 0) {
            return 0;
        }

        $completedEnrollments = $this->enrollments()
            ->whereNotNull('completed_at')
            ->count();

        return round(($completedEnrollments / $totalEnrollments) * 100, 1);
    }

    /**
     * Check if the course has preview lessons.
     */
    private function hasPreviewLessons(): bool
    {
        return $this->lessons()->where('is_preview', true)->exists();
    }
}
