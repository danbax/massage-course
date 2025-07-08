<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'template_content',
        'background_image',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user certificates.
     */
    public function userCertificates(): HasMany
    {
        return $this->hasMany(UserCertificate::class);
    }

    /**
     * Scope a query to only include active certificates.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Generate certificate content for a user.
     */
    public function generateContent(User $user, array $data = []): string
    {
        $defaultData = [
            'student_name' => $user->name,
            'completion_date' => now()->format('F j, Y'),
            'course_title' => 'Professional Relaxation Massage Therapy Course',
        ];

        $mergedData = array_merge($defaultData, $data);
        
        $content = $this->template_content;
        
        foreach ($mergedData as $key => $value) {
            $content = str_replace('{' . $key . '}', $value, $content);
        }
        
        return $content;
    }

    /**
     * Get the default certificate for the system.
     */
    public static function getDefault(): ?Certificate
    {
        return static::active()->first();
    }
}