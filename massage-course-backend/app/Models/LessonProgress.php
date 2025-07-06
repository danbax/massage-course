<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'watch_time_seconds',
        'watch_percentage',
        'is_completed',
        'completed_at',
        'quiz_score',
        'quiz_attempts',
        'notes'
    ];

    protected $casts = [
        'watch_time_seconds' => 'integer',
        'watch_percentage' => 'decimal:2',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
        'quiz_score' => 'decimal:2',
        'quiz_attempts' => 'integer',
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
     * Get the lesson that owns the progress.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Mark the lesson as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
            'watch_percentage' => 100.00
        ]);
    }

    /**
     * Update watch progress.
     */
    public function updateWatchProgress(int $watchTimeSeconds, float $percentage): void
    {
        $this->update([
            'watch_time_seconds' => max($this->watch_time_seconds, $watchTimeSeconds),
            'watch_percentage' => max($this->watch_percentage, $percentage)
        ]);

        // Auto-complete if watched 90% or more
        if ($percentage >= 90 && !$this->is_completed) {
            $this->markAsCompleted();
        }
    }

    /**
     * Update quiz score.
     */
    public function updateQuizScore(float $score): void
    {
        $this->update([
            'quiz_score' => max($this->quiz_score ?? 0, $score),
            'quiz_attempts' => $this->quiz_attempts + 1
        ]);
    }

    /**
     * Get formatted watch time.
     */
    public function getFormattedWatchTimeAttribute(): string
    {
        $seconds = $this->watch_time_seconds;
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;

        if ($minutes > 0) {
            return sprintf('%d:%02d', $minutes, $remainingSeconds);
        }

        return sprintf('%ds', $seconds);
    }

    /**
     * Check if the lesson has been started.
     */
    public function getIsStartedAttribute(): bool
    {
        return $this->watch_time_seconds > 0;
    }
}
