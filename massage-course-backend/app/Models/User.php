<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'phone',
        'date_of_birth',
        'profession',
        'bio',
        'is_admin',
        'email_verified_at',
        'last_login_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'is_admin' => 'boolean',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the courses the user is enrolled in.
     */
    public function enrolledCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_enrollments')
                    ->withPivot(['enrolled_at', 'completed_at', 'progress_percentage'])
                    ->withTimestamps();
    }

    /**
     * Get the user's course enrollments.
     */
    public function courseEnrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    /**
     * Get the user's overall course progress.
     */
    public function courseProgress(): HasMany
    {
        return $this->hasMany(UserProgress::class);
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
     * Check if the user is enrolled in a course.
     */
    public function isEnrolledIn(Course $course): bool
    {
        return $this->enrolledCourses()->where('course_id', $course->id)->exists();
    }

    /**
     * Check if the user has completed a course.
     */
    public function hasCompletedCourse(Course $course): bool
    {
        return $this->courseEnrollments()
                    ->where('course_id', $course->id)
                    ->whereNotNull('completed_at')
                    ->exists();
    }

    /**
     * Get the progress for a specific course.
     */
    public function getProgressForCourse(Course $course): ?UserProgress
    {
        return $this->courseProgress()->where('course_id', $course->id)->first();
    }

    /**
     * Check if the user is an admin.
     */
    public function getIsAdminAttribute(): bool
    {
        return $this->attributes['is_admin'] === true || $this->attributes['is_admin'] === 1;
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset('storage/avatars/' . $this->avatar);
        }

        // Return default avatar or gravatar
        return 'https://www.gravatar.com/avatar/' . md5(strtolower(trim($this->email))) . '?d=mp&s=200';
    }
}
