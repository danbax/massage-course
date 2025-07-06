<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'completed_lessons',
        'total_lessons',
        'progress_percentage',
        'last_lesson_id',
        'time_spent_minutes',
        'started_at',
        'completed_at'
    ];

    protected $casts = [
        'completed_lessons' => 'integer',
        'total_lessons' => 'integer',
        'progress_percentage' => 'decimal:2',
        'time_spent_minutes' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user that owns the progress.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the course that owns the progress.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the last accessed lesson.
     */
    public function lastLesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'last_lesson_id');
    }

    /**
     * Check if the course is completed.
     */
    public function getIsCompletedAttribute(): bool
    {
        return !is_null($this->completed_at) && $this->progress_percentage >= 100;
    }

    /**
     * Update progress based on lesson completion.
     */
    public function updateProgress(): void
    {
        $totalLessons = $this->course->lessons()->published()->count();
        $completedLessons = LessonProgress::where('user_id', $this->user_id)
            ->whereHas('lesson.module', function ($query) {
                $query->where('course_id', $this->course_id);
            })
            ->where('is_completed', true)
            ->count();

        $progressPercentage = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;

        $this->update([
            'completed_lessons' => $completedLessons,
            'total_lessons' => $totalLessons,
            'progress_percentage' => round($progressPercentage, 2),
            'completed_at' => $progressPercentage >= 100 ? now() : null
        ]);
    }

    /**
     * Add time spent on the course.
     */
    public function addTimeSpent(int $minutes): void
    {
        $this->increment('time_spent_minutes', $minutes);
    }

    /**
     * Get formatted time spent.
     */
    public function getFormattedTimeSpentAttribute(): string
    {
        $minutes = $this->time_spent_minutes;
        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        if ($hours > 0) {
            return sprintf('%dh %dm', $hours, $remainingMinutes);
        }

        return sprintf('%dm', $minutes);
    }
}
