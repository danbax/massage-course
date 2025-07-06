<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lesson extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'module_id',
        'title',
        'description',
        'content',
        'video_url',
        'video_duration_seconds',
        'duration_minutes',
        'thumbnail',
        'sort_order',
        'is_published',
        'is_preview',
        'resources',
        'quiz_questions'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_preview' => 'boolean',
        'resources' => 'array',
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
     * Get the course through the module.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id')
                    ->orWhereHas('module.course');
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
     * Scope a query to only include preview lessons.
     */
    public function scopePreview($query)
    {
        return $query->where('is_preview', true);
    }

    /**
     * Scope a query to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
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
        return !empty($this->quiz_questions) && count($this->quiz_questions) > 0;
    }
}
