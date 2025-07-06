<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
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
            'certificate_number' => $this->certificate_number,
            'verification_code' => $this->verification_code,
            'issued_at' => $this->issued_at->format('Y-m-d H:i:s'),
            'download_url' => $this->download_url,
            'verification_url' => $this->verification_url,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            
            // Include related data when loaded
            'course' => new CourseResource($this->whenLoaded('course')),
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
