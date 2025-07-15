<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AllpayService
{
    private string $apiLogin;
    private string $apiKey;
    private string $apiUrl;
    private string $notificationUrl;
    private string $successUrl;
    private string $backUrl;

    public function __construct()
    {
        $this->apiLogin = config('services.allpay.login');
        $this->apiKey = config('services.allpay.key');
        $this->apiUrl = config('services.allpay.api_url', 'https://allpay.to/app/?show=getpayment&mode=api8');
        $this->notificationUrl = config('app.url') . '/api/payments/allpay/webhook';
        $this->successUrl = config('app.frontend_url') . '/payment-success';
        $this->backUrl = config('app.frontend_url') . '/purchase';
    }

    public function createPaymentLink(User $user, float $amount, string $currency = 'USD'): array
    {
        $orderId = 'ORDER_' . time() . '_' . $user->id;
        
        $requestData = [
            'login' => $this->apiLogin,
            'order_id' => $orderId,
            'items' => [
                [
                    'name' => 'Professional Relaxation Massage Therapy Course',
                    'price' => $amount,
                    'qty' => 1,
                    'vat' => 0
                ]
            ],
            'currency' => $currency,
            'lang' => 'EN',
            'notifications_url' => $this->notificationUrl,
            'success_url' => $this->successUrl,
            'backlink_url' => $this->backUrl,
            'client_name' => $user->name,
            'client_email' => $user->email,
            'client_phone' => $user->phone ?? '',
            'client_tehudat' => $user->tax_id ?? '000000000',
            'expire' => time() + 3600
        ];

        $signature = $this->generateSignature($requestData);
        $requestData['sign'] = $signature;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->post($this->apiUrl, $requestData);

            if (!$response->successful()) {
                throw new \Exception('Allpay API request failed: ' . $response->body());
            }

            $responseData = $response->json();
            
            if (!isset($responseData['payment_url'])) {
                throw new \Exception('Invalid response from Allpay API');
            }

            return [
                'payment_url' => $responseData['payment_url'],
                'order_id' => $orderId,
                'request_data' => $requestData
            ];

        } catch (\Exception $e) {
            Log::error('Allpay payment creation failed', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'amount' => $amount
            ]);
            throw $e;
        }
    }

    public function verifyPaymentStatus(string $orderId): array
    {
        $requestData = [
            'login' => $this->apiLogin,
            'order_id' => $orderId
        ];

        $signature = $this->generateSignature($requestData);
        $requestData['sign'] = $signature;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->post('https://allpay.to/app/?show=paymentstatus&mode=api8', $requestData);

            if (!$response->successful()) {
                throw new \Exception('Allpay status check failed');
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Allpay status check failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId
            ]);
            throw $e;
        }
    }

    public function processRefund(string $orderId, float $amount = null): array
    {
        $requestData = [
            'login' => $this->apiLogin,
            'order_id' => $orderId
        ];

        if ($amount !== null) {
            $requestData['amount'] = $amount;
        }

        $signature = $this->generateSignature($requestData);
        $requestData['sign'] = $signature;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->post('https://allpay.to/app/?show=refund&mode=api8', $requestData);

            if (!$response->successful()) {
                throw new \Exception('Allpay refund failed');
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Allpay refund failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId
            ]);
            throw $e;
        }
    }

    public function validateWebhook(array $data): bool
    {
        if (!isset($data['sign'])) {
            return false;
        }

        $receivedSignature = $data['sign'];
        unset($data['sign']);
        
        $expectedSignature = $this->generateSignature($data);
        
        return hash_equals($expectedSignature, $receivedSignature);
    }

    public function processWebhook(array $data): void
    {
        if (!$this->validateWebhook($data)) {
            throw new \Exception('Invalid webhook signature');
        }

        $orderId = $data['order_id'];
        $status = $data['status'];
        $amount = $data['amount'] ?? 0;

        $payment = Payment::where('provider_transaction_id', $orderId)
                         ->where('payment_provider', 'allpay')
                         ->first();

        if (!$payment) {
            Log::warning('Payment not found for Allpay webhook', ['order_id' => $orderId]);
            return;
        }

        $paymentStatus = match($status) {
            '1' => 'succeeded',
            '0' => 'failed',
            '3' => 'refunded',
            default => 'pending'
        };

        if ($payment->status !== $paymentStatus) {
            $payment->update([
                'status' => $paymentStatus,
                'processed_at' => now(),
                'payment_data' => array_merge($payment->payment_data ?? [], [
                    'webhook_data' => $data,
                    'card_mask' => $data['card_mask'] ?? null,
                    'card_brand' => $data['card_brand'] ?? null,
                    'foreign_card' => $data['foreign_card'] ?? null,
                    'receipt' => $data['receipt'] ?? null
                ])
            ]);

            if ($paymentStatus === 'succeeded') {
                $payment->user->update(['has_course_access' => true]);
                Log::info('Payment succeeded via Allpay webhook', [
                    'payment_id' => $payment->id,
                    'order_id' => $orderId
                ]);
            } elseif ($paymentStatus === 'refunded') {
                $payment->user->update(['has_course_access' => false]);
            }
        }
    }

    private function generateSignature(array $params): string
    {
        ksort($params);
        $chunks = [];
        
        foreach ($params as $key => $value) {
            if (is_array($value)) {
                foreach ($value as $item) {
                    if (is_array($item)) {
                        ksort($item);
                        foreach ($item as $itemKey => $itemValue) {
                            if (trim((string)$itemValue) !== '') {
                                $chunks[] = (string)$itemValue;
                            }
                        }
                    }
                }
            } else {
                if (trim((string)$value) !== '' && $key !== 'sign') {
                    $chunks[] = (string)$value;
                }
            }
        }
        
        $signature = implode(':', $chunks) . ':' . $this->apiKey;
        return hash('sha256', $signature);
    }

    public function testConnection(): array
    {
        try {
            $testData = [
                'login' => $this->apiLogin,
                'order_id' => 'TEST_' . time()
            ];
            
            $signature = $this->generateSignature($testData);
            $testData['sign'] = $signature;
            
            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->post('https://allpay.to/app/?show=paymentstatus&mode=api8', $testData);
            
            return [
                'success' => true,
                'status_code' => $response->status(),
                'response' => $response->json()
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}