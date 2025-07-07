<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'stripe_payment_intent_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'payment_provider',
        'provider_transaction_id',
        'payment_data',
        'metadata',
        'processed_at',
        'refunded_at',
        'refund_amount'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'payment_data' => 'array',
        'metadata' => 'array',
        'processed_at' => 'datetime',
        'refunded_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SUCCEEDED = 'succeeded';
    const STATUS_FAILED = 'failed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_REFUNDED = 'refunded';

    /**
     * Get the user that owns the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the course.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Scope a query to only include successful payments.
     */
    public function scopeSuccessful($query)
    {
        return $query->where('status', self::STATUS_SUCCEEDED);
    }

    /**
     * Scope a query to only include pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Check if the payment is successful.
     */
    public function getIsSuccessfulAttribute(): bool
    {
        return $this->status === self::STATUS_SUCCEEDED;
    }

    /**
     * Check if the payment is refunded.
     */
    public function getIsRefundedAttribute(): bool
    {
        return $this->status === self::STATUS_REFUNDED;
    }

    /**
     * Mark payment as successful.
     */
    public function markAsSuccessful(): void
    {
        $this->update([
            'status' => self::STATUS_SUCCEEDED,
            'processed_at' => now()
        ]);
    }

    /**
     * Mark payment as failed.
     */
    public function markAsFailed(): void
    {
        $this->update(['status' => self::STATUS_FAILED]);
    }

    /**
     * Process refund.
     */
    public function processRefund(float $amount = null): void
    {
        $this->update([
            'status' => self::STATUS_REFUNDED,
            'refunded_at' => now(),
            'refund_amount' => $amount ?? $this->amount
        ]);
    }
}
