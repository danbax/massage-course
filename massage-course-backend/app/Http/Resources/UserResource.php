<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'phone' => $this->phone,
            'profession' => $this->profession,
            'bio' => $this->bio,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'experience_level' => $this->experience_level,
            'certifications' => $this->certifications,
            'specializations' => $this->specializations,
            'country' => $this->country,
            'city' => $this->city,
            'language' => $this->language,
            'timezone' => $this->timezone,
            'marketing_consent' => $this->marketing_consent,
            'newsletter_subscription' => $this->newsletter_subscription,
            'notification_preferences' => $this->notification_preferences,
            'is_admin' => $this->is_admin,
            'role' => $this->role,
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i:s'),
            'last_login_at' => $this->last_login_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Include related data when loaded
            'certificates' => $this->whenLoaded('certificates'),
            'progress' => $this->whenLoaded('progress'),
        ];
    }
}
