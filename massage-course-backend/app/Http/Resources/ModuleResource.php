<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
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
            'sort_order' => $this->sort_order,
            'is_published' => $this->is_published,
            'total_lessons' => $this->total_lessons,
            'total_duration' => $this->total_duration,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Include lessons when loaded
            'lessons' => LessonResource::collection($this->whenLoaded('lessons')),
        ];
    }
}
