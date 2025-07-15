<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\ProcessPaymentRequest;
use App\Models\Payment;
use App\Models\User;
use App\Services\Invoice4UService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function __construct(
        private Invoice4UService $invoice4uService
    ) {}

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

    public function createPaymentIntent(Request $request): JsonResponse
    {
        $user = $request->user();

        $existingPayment = $user->payments()->where('status', 'succeeded')->first();
        if ($existingPayment) {
            return response()->json([
                'message' => 'Already have access to the course'
            ], 409);
        }

        $coursePrice = 297.00;
        $currency = 'ILS';

        try {
            DB::beginTransaction();

            $invoice = $this->invoice4uService->createInvoice($user, $coursePrice, $currency);
            
            $paymentLink = $this->invoice4uService->createPaymentLink(
                $invoice['id'], 
                $coursePrice, 
                $currency
            );

            $payment = Payment::create([
                'user_id' => $user->id,
                'amount' => $coursePrice,
                'currency' => $currency,
                'status' => 'pending',
                'payment_method' => 'invoice4u',
                'payment_provider' => 'invoice4u',
                'provider_transaction_id' => $paymentLink['id'],
                'payment_data' => [
                    'invoice_id' => $invoice['id'],
                    'payment_link_id' => $paymentLink['id'],
                    'payment_url' => $paymentLink['payment_url'],
                    'invoice_data' => $invoice
                ]
            ]);

            DB::commit();

            return response()->json([
                'payment_id' => $payment->id,
                'invoice_id' => $invoice['id'],
                'payment_url' => $paymentLink['payment_url'],
                'amount' => $coursePrice,
                'currency' => $currency,
                'expires_at' => $paymentLink['expires_at'] ?? null,
                'description' => 'Professional Relaxation Massage Therapy Course'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Payment intent creation failed', [
                'user_id' => $user->id,
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

        $user = $request->user();
        $payment = Payment::where('id', $request->payment_id)
                         ->where('user_id', $user->id)
                         ->firstOrFail();

        if ($payment->status === 'succeeded') {
            return response()->json([
                'message' => 'Payment already confirmed',
                'payment' => $payment,
                'course_access' => true
            ]);
        }

        try {
            $invoiceId = $payment->payment_data['invoice_id'];
            $invoice = $this->invoice4uService->getInvoice($invoiceId);

            if ($invoice['status'] === 'paid') {
                $payment->update([
                    'status' => 'succeeded',
                    'processed_at' => now(),
                    'payment_data' => array_merge($payment->payment_data, [
                        'confirmed_at' => now()->toISOString(),
                        'invoice_status' => $invoice['status']
                    ])
                ]);

                $user->update(['has_course_access' => true]);

                $this->invoice4uService->sendInvoiceByEmail($invoiceId, $user->email);

                return response()->json([
                    'message' => 'Payment confirmed and course access granted',
                    'payment' => $payment->fresh(),
                    'course_access' => true
                ]);
            }

            return response()->json([
                'message' => 'Payment not yet confirmed by Invoice4U',
                'payment_status' => $invoice['status']
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

    public function show(Payment $payment, Request $request): JsonResponse
    {
        $this->authorize('view', $payment);

        $paymentData = $payment->toArray();
        
        if ($payment->payment_provider === 'invoice4u' && isset($payment->payment_data['invoice_id'])) {
            try {
                $invoice = $this->invoice4uService->getInvoice($payment->payment_data['invoice_id']);
                $paymentData['invoice_details'] = $invoice;
            } catch (\Exception $e) {
                Log::warning('Failed to fetch invoice details', [
                    'payment_id' => $payment->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return response()->json([
            'payment' => $paymentData
        ]);
    }

    public function handleWebhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $signature = $request->header('X-Invoice4U-Signature');

        try {
            if (!$this->invoice4uService->validateWebhook($payload, $signature)) {
                Log::warning('Invalid Invoice4U webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            $webhookData = json_decode($payload, true);
            $this->invoice4uService->processWebhook($webhookData);
            
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Invoice4U webhook error: ' . $e->getMessage());
            
            return response()->json(['error' => 'Webhook failed'], 400);
        }
    }

    public function requestRefund(Payment $payment, Request $request): JsonResponse
    {
        $this->authorize('refund', $payment);

        $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        if ($payment->status !== 'succeeded') {
            return response()->json([
                'message' => 'Can only refund successful payments'
            ], 400);
        }

        try {
            $paymentId = $payment->provider_transaction_id;
            $refund = $this->invoice4uService->refundPayment($paymentId, null, $request->reason);

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
        
        $hasAccess = $user->payments()->where('status', 'succeeded')->exists() || 
                    $user->has_course_access;
        
        return response()->json([
            'has_access' => $hasAccess,
            'message' => $hasAccess ? 'Access granted' : 'Payment required for course access'
        ]);
    }

    public function downloadInvoice(Payment $payment, Request $request): JsonResponse
    {
        $this->authorize('view', $payment);

        if ($payment->payment_provider !== 'invoice4u' || !isset($payment->payment_data['invoice_id'])) {
            return response()->json([
                'message' => 'Invoice not available for this payment'
            ], 404);
        }

        try {
            $invoiceId = $payment->payment_data['invoice_id'];
            $pdf = $this->invoice4uService->getInvoicePdf($invoiceId);

            return response()->json([
                'message' => 'Invoice PDF generated successfully',
                'invoice_id' => $invoiceId,
                'pdf_base64' => base64_encode($pdf),
                'filename' => 'invoice-' . $invoiceId . '.pdf'
            ]);

        } catch (\Exception $e) {
            Log::error('Invoice download failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to download invoice',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPaymentStatus(Payment $payment, Request $request): JsonResponse
    {
        $this->authorize('view', $payment);

        if ($payment->payment_provider !== 'invoice4u') {
            return response()->json(['status' => $payment->status]);
        }

        try {
            if (isset($payment->payment_data['invoice_id'])) {
                $invoice = $this->invoice4uService->getInvoice($payment->payment_data['invoice_id']);
                
                $updatedStatus = match($invoice['status']) {
                    'paid' => 'succeeded',
                    'failed' => 'failed',
                    'pending' => 'pending',
                    'cancelled' => 'cancelled',
                    default => $payment->status
                };

                if ($updatedStatus !== $payment->status) {
                    $payment->update(['status' => $updatedStatus]);
                    
                    if ($updatedStatus === 'succeeded') {
                        $payment->user->update(['has_course_access' => true]);
                    }
                }

                return response()->json([
                    'status' => $updatedStatus,
                    'invoice_status' => $invoice['status'],
                    'updated' => $updatedStatus !== $payment->status
                ]);
            }

            return response()->json(['status' => $payment->status]);

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
            $result = $this->invoice4uService->testConnection();
            
            return response()->json([
                'message' => 'Invoice4U connection test completed',
                'result' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invoice4U connection test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}