<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\CourseEnrollment;
use App\Models\Course;
use App\Models\User;
use App\Events\PaymentCompleted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Process a payment for course enrollment
     */
    public function processPayment(User $user, Course $course, array $paymentData): Payment
    {
        return DB::transaction(function () use ($user, $course, $paymentData) {
            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'amount' => $course->price,
                'currency' => $paymentData['currency'] ?? 'USD',
                'payment_method' => $paymentData['payment_method'],
                'payment_provider' => $paymentData['payment_provider'] ?? 'stripe',
                'provider_transaction_id' => $paymentData['transaction_id'],
                'status' => 'pending',
                'payment_data' => $paymentData,
            ]);

            try {
                // Process payment with provider
                $this->processWithProvider($payment, $paymentData);
                
                // Update payment status
                $payment->update(['status' => 'completed']);
                
                // Create course enrollment
                CourseEnrollment::create([
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                    'payment_id' => $payment->id,
                    'enrolled_at' => now(),
                ]);

                // Fire payment completed event
                event(new PaymentCompleted($payment));

                Log::info('Payment processed successfully', [
                    'payment_id' => $payment->id,
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                ]);

                return $payment;
            } catch (\Exception $e) {
                $payment->update([
                    'status' => 'failed',
                    'failure_reason' => $e->getMessage(),
                ]);
                
                Log::error('Payment processing failed', [
                    'payment_id' => $payment->id,
                    'error' => $e->getMessage(),
                ]);
                
                throw $e;
            }
        });
    }

    /**
     * Process refund for a payment
     */
    public function processRefund(Payment $payment, string $reason = null): bool
    {
        if ($payment->status !== 'completed') {
            throw new \Exception('Can only refund completed payments');
        }

        try {
            // Process refund with provider
            $this->processRefundWithProvider($payment);
            
            $payment->update([
                'status' => 'refunded',
                'refunded_at' => now(),
                'refund_reason' => $reason,
            ]);

            // Remove course enrollment
            CourseEnrollment::where('payment_id', $payment->id)->delete();

            Log::info('Refund processed successfully', [
                'payment_id' => $payment->id,
                'reason' => $reason,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Refund processing failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);
            
            throw $e;
        }
    }

    /**
     * Get payment history for a user
     */
    public function getUserPayments(User $user)
    {
        return Payment::where('user_id', $user->id)
            ->with(['course'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get revenue statistics
     */
    public function getRevenueStats(string $period = 'month')
    {
        $query = Payment::where('status', 'completed');

        switch ($period) {
            case 'today':
                $query->whereDate('created_at', today());
                break;
            case 'week':
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'month':
                $query->whereMonth('created_at', now()->month)
                      ->whereYear('created_at', now()->year);
                break;
            case 'year':
                $query->whereYear('created_at', now()->year);
                break;
        }

        return [
            'total_revenue' => $query->sum('amount'),
            'total_transactions' => $query->count(),
            'average_transaction' => $query->avg('amount'),
            'revenue_by_course' => $query->groupBy('course_id')
                ->selectRaw('course_id, sum(amount) as revenue, count(*) as transactions')
                ->with('course:id,title')
                ->get(),
        ];
    }

    /**
     * Verify payment with provider
     */
    public function verifyPayment(string $transactionId, string $provider = 'stripe'): bool
    {
        try {
            switch ($provider) {
                case 'stripe':
                    return $this->verifyStripePayment($transactionId);
                case 'paypal':
                    return $this->verifyPaypalPayment($transactionId);
                default:
                    throw new \Exception("Unsupported payment provider: {$provider}");
            }
        } catch (\Exception $e) {
            Log::error('Payment verification failed', [
                'transaction_id' => $transactionId,
                'provider' => $provider,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Process payment with the actual provider
     */
    private function processWithProvider(Payment $payment, array $paymentData): void
    {
        // In a real implementation, this would integrate with actual payment providers
        // For now, we'll simulate successful processing
        
        switch ($payment->payment_provider) {
            case 'stripe':
                $this->processStripePayment($payment, $paymentData);
                break;
            case 'paypal':
                $this->processPaypalPayment($payment, $paymentData);
                break;
            default:
                throw new \Exception("Unsupported payment provider: {$payment->payment_provider}");
        }
    }

    /**
     * Process refund with the actual provider
     */
    private function processRefundWithProvider(Payment $payment): void
    {
        // In a real implementation, this would integrate with actual payment providers
        switch ($payment->payment_provider) {
            case 'stripe':
                $this->processStripeRefund($payment);
                break;
            case 'paypal':
                $this->processPaypalRefund($payment);
                break;
            default:
                throw new \Exception("Unsupported payment provider: {$payment->payment_provider}");
        }
    }

    private function processStripePayment(Payment $payment, array $paymentData): void
    {
        // Stripe payment processing logic would go here
        // For simulation, we'll just validate required data
        if (!isset($paymentData['stripe_token'])) {
            throw new \Exception('Stripe token is required');
        }
    }

    private function processPaypalPayment(Payment $payment, array $paymentData): void
    {
        // PayPal payment processing logic would go here
        if (!isset($paymentData['paypal_payment_id'])) {
            throw new \Exception('PayPal payment ID is required');
        }
    }

    private function processStripeRefund(Payment $payment): void
    {
        // Stripe refund logic would go here
    }

    private function processPaypalRefund(Payment $payment): void
    {
        // PayPal refund logic would go here
    }

    private function verifyStripePayment(string $transactionId): bool
    {
        // Stripe verification logic would go here
        return true;
    }

    private function verifyPaypalPayment(string $transactionId): bool
    {
        // PayPal verification logic would go here
        return true;
    }
}
