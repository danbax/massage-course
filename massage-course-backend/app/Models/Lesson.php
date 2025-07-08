<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class Lesson extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'module_id',
        'title',
        'description',
        'content',
        'language',
        'video_url',
        'video_duration',
        'duration_minutes',
        'thumbnail',
        'order',
        'is_published',
        'is_free',
        'has_quiz',
        'resources',
        'learning_objectives',
        'estimated_duration',
        'difficulty_level',
        'quiz_questions'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_free' => 'boolean',
        'has_quiz' => 'boolean',
        'resources' => 'array',
        'learning_objectives' => 'array',
        'quiz_questions' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    /**
     * Get the module that owns the lesson.
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the lesson progress records.
     */
    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    /**
     * Scope a query to only include published lessons.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to only include free lessons.
     */
    public function scopeFree($query)
    {
        return $query->where('is_free', true);
    }

    /**
     * Scope a query to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Get the lesson progress for a specific user.
     */
    public function getProgressForUser(User $user): ?LessonProgress
    {
        return $this->progress()->where('user_id', $user->id)->first();
    }

    /**
     * Check if the lesson has been completed by a user.
     */
    public function isCompletedByUser(User $user): bool
    {
        $progress = $this->getProgressForUser($user);
        return $progress && $progress->is_completed;
    }

    /**
     * Get the watch percentage for a user.
     */
    public function getWatchPercentageForUser(User $user): float
    {
        $progress = $this->getProgressForUser($user);
        return $progress ? $progress->watch_percentage : 0;
    }

    /**
     * Get the formatted duration.
     */
    public function getFormattedDurationAttribute(): string
    {
        $minutes = $this->duration_minutes;
        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        if ($hours > 0) {
            return sprintf('%d:%02d', $hours, $remainingMinutes);
        }

        return sprintf('%d min', $minutes);
    }

    /**
     * Check if the lesson has video content.
     */
    public function getHasVideoAttribute(): bool
    {
        return !empty($this->video_url);
    }

    /**
     * Check if the lesson has quiz questions.
     */
    public function getHasQuizAttribute(): bool
    {
        try {
            $quizQuestions = $this->quiz_questions;
            
            // Handle cases where quiz_questions might be null, empty, or malformed
            if (empty($quizQuestions)) {
                return false;
            }
            
            // Ensure it's an array and count it
            if (is_array($quizQuestions)) {
                return count($quizQuestions) > 0;
            }
            
            // If it's a string (JSON), try to decode it
            if (is_string($quizQuestions)) {
                $decoded = json_decode($quizQuestions, true);
                return is_array($decoded) && count($decoded) > 0;
            }
            
            return false;
        } catch (\Exception $e) {
            // Log the error and return false as fallback
            Log::warning('Error checking quiz questions for lesson ' . $this->id . ': ' . $e->getMessage());
            return false;
        }
    }
}
