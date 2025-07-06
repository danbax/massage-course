<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'certificate_id',
        'course_id',
        'certificate_number',
        'issued_at',
        'file_path',
        'verification_code'
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user that owns the certificate.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the certificate template.
     */
    public function certificate(): BelongsTo
    {
        return $this->belongsTo(Certificate::class);
    }

    /**
     * Get the course.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Generate a unique certificate number.
     */
    public static function generateCertificateNumber(): string
    {
        return 'CERT-' . strtoupper(uniqid()) . '-' . date('Y');
    }

    /**
     * Generate a verification code.
     */
    public static function generateVerificationCode(): string
    {
        return strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
    }

    /**
     * Get the download URL for the certificate.
     */
    public function getDownloadUrlAttribute(): string
    {
        return route('api.certificates.download', ['certificate' => $this->id]);
    }

    /**
     * Get the verification URL for the certificate.
     */
    public function getVerificationUrlAttribute(): string
    {
        return route('certificates.verify', ['code' => $this->verification_code]);
    }
}
