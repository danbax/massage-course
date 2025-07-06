<?php

namespace App\Listeners;

use App\Events\PaymentCompleted;
use App\Mail\PaymentReceiptEmail;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ProcessPaymentNotification
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(PaymentCompleted $event): void
    {
        try {
            $payment = $event->payment;
            
            // Load the relationships
            if (!$payment->relationLoaded('user')) {
                $payment->load('user');
            }
            if (!$payment->relationLoaded('course')) {
                $payment->load('course');
            }
            
            $user = $payment->user;
            $course = $payment->course;

            // Send payment receipt email
            Mail::to($user->email)->send(new PaymentReceiptEmail($user, $payment));
            
            // Send payment confirmation notification
            $this->notificationService->sendPaymentConfirmationNotification($user, $payment);
            
            // Send course enrollment notification
            $this->notificationService->sendCourseEnrollmentNotification($user, $course);
            
            Log::info('Payment notifications processed successfully', [
                'user_id' => $user->id,
                'payment_id' => $payment->id,
                'course_id' => $course->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process payment notifications', [
                'payment_id' => $event->payment->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
