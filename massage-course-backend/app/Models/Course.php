<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'price',
        'duration_hours',
        'difficulty_level',
        'instructor_name',
        'instructor_bio',
        'instructor_avatar',
        'learning_objectives',
        'prerequisites',
        'is_published',
        'published_at',
        'meta_title',
        'meta_description',
        'sort_order'
    ];

    protected $casts = [
        'learning_objectives' => 'array',
        'prerequisites' => 'array',
        'price' => 'decimal:2',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    /**
     * Get the modules for the course.
     */
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    /**
     * Get all lessons for the course through modules.
     */
    public function lessons(): HasManyThrough
    {
        return $this->hasManyThrough(Lesson::class, Module::class)
                    ->orderBy('modules.order')
                    ->orderBy('lessons.order');
    }

    /**
     * Get all users (since all users have access to this course).
     */
    public function users()
    {
        return User::all(); // All users have access to the course
    }

    /**
     * Get the certificates for this course.
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    /**
     * Get the payments for this course.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include published courses.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('title');
    }

    /**
     * Get the total number of lessons in the course.
     */
    public function getTotalLessonsAttribute(): int
    {
        return $this->lessons()->count();
    }

    /**
     * Get the total duration of all lessons in minutes.
     */
    public function getTotalDurationAttribute(): int
    {
        return $this->lessons()->sum('lessons.duration_minutes');
    }

    /**
     * Get the number of total students (all users have access).
     */
    public function getEnrolledStudentsCountAttribute(): int
    {
        return User::count(); // All users have access to the course
    }

    /**
     * Get the average rating for the course.
     */
    public function getAverageRatingAttribute(): float
    {
        // This would be implemented if you add a rating system
        return 0.0;
    }

    /**
     * Check if the course is free.
     */
    public function getIsFreeAttribute(): bool
    {
        return $this->price <= 0;
    }
}
