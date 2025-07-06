<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
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
     * Get the course that owns the certificate.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

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
}
