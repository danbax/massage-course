<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\ProcessPaymentRequest;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    ) {}

    /**
     * Get user's payment history.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $payments = $user->payments()
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'payments' => $payments->items(),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total()
            ]
        ]);
    }

    /**
     * Create payment intent for course purchase.
     */
    public function createPaymentIntent(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if user has already made a successful payment
        $existingPayment = $user->payments()->where('status', 'succeeded')->first();
        if ($existingPayment) {
            return response()->json([
                'message' => 'Already have access to the course'
            ], 409);
        }

        // Course price - this would typically come from settings or config
        $coursePrice = 297.00; // Professional Relaxation Massage Therapy Course price

        $paymentIntent = $this->paymentService->createPaymentIntent($user, $coursePrice);

        return response()->json([
            'client_secret' => $paymentIntent['client_secret'],
            'payment_intent_id' => $paymentIntent['id'],
            'amount' => $coursePrice,
            'currency' => 'usd',
            'description' => 'Professional Relaxation Massage Therapy Course'
        ]);
    }

    /**
     * Confirm payment and complete course access.
     */
    public function confirmPayment(Request $request): JsonResponse
    {
        $request->validate([
            'payment_intent_id' => 'required|string'
        ]);

        $user = $request->user();

        try {
            $payment = $this->paymentService->confirmPayment(
                $request->payment_intent_id,
                $user
            );

            return response()->json([
                'message' => 'Payment confirmed and course access granted',
                'payment' => $payment,
                'course_access' => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Payment confirmation failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Show specific payment.
     */
    public function show(Payment $payment, Request $request): JsonResponse
    {
        $this->authorize('view', $payment);

        return response()->json([
            'payment' => $payment
        ]);
    }

    /**
     * Handle Stripe webhooks.
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            $this->paymentService->handleWebhook($payload, $signature);
            
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            \Log::error('Webhook error: ' . $e->getMessage());
            
            return response()->json(['error' => 'Webhook failed'], 400);
        }
    }

    /**
     * Request refund for a payment.
     */
    public function requestRefund(Payment $payment, Request $request): JsonResponse
    {
        $this->authorize('refund', $payment);

        $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        try {
            $refund = $this->paymentService->processRefund($payment, $request->reason);

            return response()->json([
                'message' => 'Refund processed successfully',
                'refund' => $refund
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Refund failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Check if user has course access.
     */
    public function checkAccess(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $hasAccess = $user->payments()->where('status', 'succeeded')->exists();
        
        return response()->json([
            'has_access' => $hasAccess,
            'message' => $hasAccess ? 'Access granted' : 'Payment required for course access'
        ]);
    }
}