<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'watch_time_seconds' => 'nullable|integer|min:0',
            'watch_percentage' => 'nullable|numeric|min:0|max:100',
            'is_completed' => 'nullable|boolean',
            'notes' => 'nullable|string|max:5000'
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'watch_time_seconds.integer' => 'Watch time must be a valid number',
            'watch_time_seconds.min' => 'Watch time cannot be negative',
            'watch_percentage.numeric' => 'Watch percentage must be a valid number',
            'watch_percentage.min' => 'Watch percentage cannot be negative',
            'watch_percentage.max' => 'Watch percentage cannot exceed 100',
            'notes.max' => 'Notes cannot exceed 5000 characters'
        ];
    }
}
