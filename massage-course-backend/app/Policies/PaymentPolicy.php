<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PaymentPolicy
{
    /**
     * Determine whether the user can view any payments.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can view the payment.
     */
    public function view(User $user, Payment $payment): bool
    {
        return $user->id === $payment->user_id || 
               $user->role === 'admin' || 
               $user->role === 'instructor';
    }

    /**
     * Determine whether the user can create payments.
     */
    public function create(User $user): bool
    {
        return true; // Users can create their own payments
    }

    /**
     * Determine whether the user can update the payment.
     */
    public function update(User $user, Payment $payment): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the payment.
     */
    public function delete(User $user, Payment $payment): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can refund the payment.
     */
    public function refund(User $user, Payment $payment): bool
    {
        return $user->role === 'admin' && $payment->status === 'succeeded';
    }

    /**
     * Determine whether the user can view payment details.
     */
    public function viewDetails(User $user, Payment $payment): bool
    {
        return $user->id === $payment->user_id || 
               $user->role === 'admin';
    }

    /**
     * Determine whether the user can download payment receipt.
     */
    public function downloadReceipt(User $user, Payment $payment): bool
    {
        return $user->id === $payment->user_id || 
               $user->role === 'admin' || 
               $user->role === 'instructor';
    }

    /**
     * Determine whether the user can view payment analytics.
     */
    public function viewAnalytics(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can export payment data.
     */
    public function export(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can manually mark payment as successful.
     */
    public function markSuccessful(User $user, Payment $payment): bool
    {
        return $user->role === 'admin' && 
               in_array($payment->status, ['pending', 'processing', 'failed']);
    }

    /**
     * Determine whether the user can manually mark payment as failed.
     */
    public function markFailed(User $user, Payment $payment): bool
    {
        return $user->role === 'admin' && 
               in_array($payment->status, ['pending', 'processing']);
    }
}