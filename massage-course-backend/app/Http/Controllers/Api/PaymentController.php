<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\ProcessPaymentRequest;
use App\Models\Course;
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
            ->with('course')
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
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $user = $request->user();
        $course = Course::findOrFail($request->course_id);

        // Check if user is already enrolled
        if ($user->isEnrolledIn($course)) {
            return response()->json([
                'message' => 'Already enrolled in this course'
            ], 409);
        }

        // Check if course is free
        if ($course->is_free) {
            return response()->json([
                'message' => 'This course is free - no payment required'
            ], 400);
        }

        $paymentIntent = $this->paymentService->createPaymentIntent($user, $course);

        return response()->json([
            'client_secret' => $paymentIntent['client_secret'],
            'payment_intent_id' => $paymentIntent['id'],
            'amount' => $course->price,
            'currency' => 'usd'
        ]);
    }

    /**
     * Confirm payment and complete enrollment.
     */
    public function confirmPayment(Request $request): JsonResponse
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
            'course_id' => 'required|exists:courses,id'
        ]);

        $user = $request->user();
        $course = Course::findOrFail($request->course_id);

        try {
            $payment = $this->paymentService->confirmPayment(
                $request->payment_intent_id,
                $user,
                $course
            );

            return response()->json([
                'message' => 'Payment confirmed and enrollment completed',
                'payment' => $payment,
                'enrolled' => true
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
            'payment' => $payment->load('course')
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
}
