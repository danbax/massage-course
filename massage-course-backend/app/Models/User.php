<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'avatar_url',
        'phone',
        'date_of_birth',
        'gender',
        'profession',
        'experience_level',
        'certifications',
        'specializations',
        'bio',
        'marketing_consent',
        'newsletter_subscription',
        'notification_preferences',
        'is_admin',
        'role',
        'timezone',
        'language',
        'country',
        'city',
        'last_login_at',
        'email_verified_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'certifications' => 'array',
            'specializations' => 'array',
            'marketing_consent' => 'boolean',
            'newsletter_subscription' => 'boolean',
            'notification_preferences' => 'array',
            'is_admin' => 'boolean',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's overall progress (single course system).
     */
    public function progress(): HasOne
    {
        return $this->hasOne(UserProgress::class);
    }

    /**
     * Get the user's lesson progress.
     */
    public function lessonProgress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    /**
     * Get the user's certificates.
     */
    public function certificates(): HasMany
    {
        return $this->hasMany(UserCertificate::class);
    }

    /**
     * Get the user's payments.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Check if the user has completed the course.
     */
    public function hasCompletedCourse(): bool
    {
        $progress = $this->progress;
        return $progress && $progress->completed_at !== null;
    }

    /**
     * Check if the user has completed at least one lesson for certificate eligibility.
     */
    public function hasCompletedAtLeastOneLesson(): bool
    {
        $progress = $this->progress;
        return $progress && $progress->completed_lessons > 0;
    }

    /**
     * Get the user's course progress percentage.
     */
    public function getProgressPercentage(): float
    {
        $progress = $this->progress;
        return $progress ? $progress->progress_percentage : 0;
    }

    /**
     * Check if the user is an admin.
     */
    public function getIsAdminAttribute(): bool
    {
        return $this->attributes['is_admin'] === true || $this->attributes['is_admin'] === 1 || $this->role === 'admin';
    }

    /**
     * Check if the user is an instructor.
     */
    public function getIsInstructorAttribute(): bool
    {
        return $this->role === 'instructor';
    }

    /**
     * Check if the user is a student.
     */
    public function getIsStudentAttribute(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->attributes['avatar_url']) {
            return $this->attributes['avatar_url'];
        }

        if ($this->avatar) {
            return asset('storage/avatars/' . $this->avatar);
        }

        return 'https://www.gravatar.com/avatar/' . md5(strtolower(trim($this->email))) . '?d=mp&s=200';
    }

    /**
     * Get completed lessons count for the user.
     */
    public function getCompletedLessonsCount(): int
    {
        return $this->lessonProgress()->where('is_completed', true)->count();
    }

    /**
     * Get total time spent learning.
     */
    public function getTotalTimeSpent(): int
    {
        $progress = $this->progress;
        return $progress ? $progress->time_spent_minutes : 0;
    }
}