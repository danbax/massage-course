<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseEnrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'enrolled_at',
        'completed_at',
        'progress_percentage',
        'last_accessed_at'
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
        'last_accessed_at' => 'datetime',
        'progress_percentage' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user that owns the enrollment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the course that owns the enrollment.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Check if the course is completed.
     */
    public function getIsCompletedAttribute(): bool
    {
        return !is_null($this->completed_at);
    }

    /**
     * Get the enrollment duration in days.
     */
    public function getEnrollmentDurationAttribute(): int
    {
        return $this->enrolled_at->diffInDays(now());
    }

    /**
     * Mark the course as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'completed_at' => now(),
            'progress_percentage' => 100.00
        ]);
    }

    /**
     * Update the last accessed timestamp.
     */
    public function updateLastAccessed(): void
    {
        $this->update(['last_accessed_at' => now()]);
    }
}
