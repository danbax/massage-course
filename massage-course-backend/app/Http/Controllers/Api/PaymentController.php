<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Services\AllpayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function __construct(
        private AllpayService $allpayService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Authentication required'
            ], 401);
        }
        
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

    public function createPaymentIntent(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'plan' => 'required|string|in:basic,premium',
            'user_data' => 'required|array',
            'user_data.email' => 'required|email',
            'user_data.first_name' => 'required|string|max:255',
            'user_data.last_name' => 'required|string|max:255',
            'user_data.phone' => 'required|string|max:20',
        ]);

        $amount = $request->input('amount');
        $plan = $request->input('plan');
        $userData = $request->input('user_data');
        $currency = 'USD';

        $user = $request->user();
        
        if ($user) {
            $existingPayment = $user->payments()->where('status', 'succeeded')->first();
            if ($existingPayment) {
                return response()->json([
                    'message' => 'Already have access to the course'
                ], 409);
            }
        } else {
            $existingUser = User::where('email', $userData['email'])->first();
            if ($existingUser) {
                $existingPayment = $existingUser->payments()->where('status', 'succeeded')->first();
                if ($existingPayment) {
                    return response()->json([
                        'message' => 'User with this email already has course access'
                    ], 409);
                }
                $user = $existingUser;
            }
        }

        try {
            DB::beginTransaction();

            if (!$user) {
                $user = User::create([
                    'name' => $userData['first_name'] . ' ' . $userData['last_name'],
                    'email' => $userData['email'],
                    'phone' => $userData['phone'],
                    'password' => Hash::make(Str::random(12)),
                    'email_verified_at' => now(),
                ]);
            }

            $paymentLink = $this->allpayService->createPaymentLink($user, $amount, $currency, $plan);

            $payment = Payment::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'currency' => $currency,
                'status' => 'pending',
                'payment_method' => 'card',
                'payment_provider' => 'allpay',
                'provider_transaction_id' => $paymentLink['order_id'],
                'payment_data' => [
                    'order_id' => $paymentLink['order_id'],
                    'payment_url' => $paymentLink['payment_url'],
                    'request_data' => $paymentLink['request_data'],
                    'plan' => $plan,
                    'user_data' => $userData
                ]
            ]);

            DB::commit();

            return response()->json([
                'payment_id' => $payment->id,
                'order_id' => $paymentLink['order_id'],
                'payment_url' => $paymentLink['payment_url'],
                'amount' => $amount,
                'currency' => $currency,
                'provider' => 'allpay',
                'plan' => $plan,
                'description' => 'Professional Relaxation Massage Therapy Course',
                'user_created' => !$request->user(),
                'user_id' => $user->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Payment intent creation failed', [
                'user_data' => $userData,
                'amount' => $amount,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to create payment intent',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function confirmPayment(Request $request): JsonResponse
    {
        $request->validate([
            'payment_id' => 'required|exists:payments,id'
        ]);

        $payment = Payment::findOrFail($request->payment_id);
        
        if ($request->user() && $payment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($payment->status === 'succeeded') {
            return response()->json([
                'message' => 'Payment already confirmed',
                'payment' => $payment,
                'course_access' => true
            ]);
        }

        try {
            $orderId = $payment->provider_transaction_id;
            $status = $this->allpayService->verifyPaymentStatus($orderId);

            if ($status['status'] == 1) {
                $payment->update([
                    'status' => 'succeeded',
                    'processed_at' => now(),
                    'payment_data' => array_merge($payment->payment_data, [
                        'confirmed_at' => now()->toISOString(),
                        'status_check' => $status
                    ])
                ]);

                $payment->user->update(['has_course_access' => true]);

                return response()->json([
                    'message' => 'Payment confirmed and course access granted',
                    'payment' => $payment->fresh(),
                    'course_access' => true
                ]);
            }

            return response()->json([
                'message' => 'Payment not yet confirmed by Allpay',
                'payment_status' => $status['status']
            ], 202);

        } catch (\Exception $e) {
            Log::error('Payment confirmation failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Payment confirmation failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function handleAllpayWebhook(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            
            Log::info('Allpay webhook received', $data);
            
            $this->allpayService->processWebhook($data);
            
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Allpay webhook error: ' . $e->getMessage(), [
                'data' => $request->all()
            ]);
            
            return response()->json(['error' => 'Webhook failed'], 400);
        }
    }

    public function show(Payment $payment, Request $request): JsonResponse
    {
        if ($request->user() && $payment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'payment' => $payment->toArray()
        ]);
    }

    public function requestRefund(Payment $payment, Request $request): JsonResponse
    {
        if ($request->user() && $payment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        if ($payment->status !== 'succeeded') {
            return response()->json([
                'message' => 'Can only refund successful payments'
            ], 400);
        }

        try {
            $orderId = $payment->provider_transaction_id;
            $refund = $this->allpayService->processRefund($orderId);

            $payment->update([
                'status' => 'refunded',
                'refunded_at' => now(),
                'refund_amount' => $payment->amount,
                'payment_data' => array_merge($payment->payment_data ?? [], [
                    'refund_data' => $refund,
                    'refund_reason' => $request->reason
                ])
            ]);

            $payment->user->update(['has_course_access' => false]);

            return response()->json([
                'message' => 'Refund processed successfully',
                'refund' => $refund,
                'payment' => $payment->fresh()
            ]);

        } catch (\Exception $e) {
            Log::error('Refund processing failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Refund failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function checkAccess(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'has_access' => false,
                'message' => 'Authentication required'
            ]);
        }
        
        $hasAccess = $user->payments()->where('status', 'succeeded')->exists() || 
                    $user->has_course_access;
        
        return response()->json([
            'has_access' => $hasAccess,
            'message' => $hasAccess ? 'Access granted' : 'Payment required for course access'
        ]);
    }

    public function getPaymentStatus(Request $request): JsonResponse
    {
        $request->validate([
            'payment_id' => 'required|exists:payments,id'
        ]);

        $payment = Payment::findOrFail($request->query('payment_id'));

        if ($request->user() && $payment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $status = $this->allpayService->verifyPaymentStatus($payment->provider_transaction_id);
            
            $updatedStatus = match($status['status']) {
                1 => 'succeeded',
                0 => 'failed',
                3 => 'refunded',
                default => 'pending'
            };

            if ($updatedStatus !== $payment->status) {
                $payment->update(['status' => $updatedStatus]);
                
                if ($updatedStatus === 'succeeded') {
                    $payment->user->update(['has_course_access' => true]);
                }
            }

            return response()->json([
                'status' => $updatedStatus,
                'allpay_status' => $status['status'],
                'updated' => $updatedStatus !== $payment->status
            ]);

        } catch (\Exception $e) {
            Log::error('Payment status check failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);

            return response()->json(['status' => $payment->status]);
        }
    }

    public function testConnection(): JsonResponse
    {
        try {
            $allpayResult = $this->allpayService->testConnection();
            
            return response()->json([
                'message' => 'Payment provider connection test completed',
                'allpay' => $allpayResult
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Connection test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}