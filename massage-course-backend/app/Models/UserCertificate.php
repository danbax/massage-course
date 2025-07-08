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
     * Generate a unique certificate number.
     */
    public static function generateCertificateNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $sequence = rand(1000, 9999);
        
        // Ensure uniqueness
        while (static::where('certificate_number', "MT-{$year}{$month}-{$sequence}")->exists()) {
            $sequence = rand(1000, 9999);
        }
        
        return "MT-{$year}{$month}-{$sequence}";
    }

    /**
     * Generate a verification code.
     */
    public static function generateVerificationCode(): string
    {
        $code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        
        // Ensure uniqueness
        while (static::where('verification_code', $code)->exists()) {
            $code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        }
        
        return $code;
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

    /**
     * Check if the certificate file exists.
     */
    public function getFileExistsAttribute(): bool
    {
        return $this->file_path && file_exists(storage_path('app/public/' . $this->file_path));
    }

    /**
     * Issue a certificate to a user.
     */
    public static function issueToUser(User $user, Certificate $certificate = null): UserCertificate
    {
        if (!$certificate) {
            $certificate = Certificate::getDefault();
        }

        if (!$certificate) {
            throw new \Exception('No certificate template available');
        }

        return static::create([
            'user_id' => $user->id,
            'certificate_id' => $certificate->id,
            'certificate_number' => static::generateCertificateNumber(),
            'issued_at' => now(),
            'verification_code' => static::generateVerificationCode(),
        ]);
    }
}