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
        $apiLogin = config('services.allpay.login');
        $apiKey = config('services.allpay.key');
        
        if (empty($apiLogin)) {
            throw new \Exception('ALLPAY_LOGIN not configured. Please add ALLPAY_LOGIN to your .env file and run "php artisan config:clear".');
        }
        
        if (empty($apiKey)) {
            throw new \Exception('ALLPAY_KEY not configured. Please add ALLPAY_KEY to your .env file and run "php artisan config:clear".');
        }
        
        $this->apiLogin = $apiLogin;
        $this->apiKey = $apiKey;
        $this->apiUrl = config('services.allpay.api_url', 'https://allpay.to/app/?show=getpayment&mode=api8');
        $this->notificationUrl = config('app.url') . '/backend/api/allpay/webhook';
        //$this->successUrl = config('app.frontend_url', config('app.url')) . '/#/signin';
        $this->successUrl = config('app.url') . '/backend/api/allpay/webhook';
        $this->backUrl = config('app.frontend_url', config('app.url')) . '/purchase';
    }

    public function createPaymentLink(User|array $user, float $amount, string $currency = 'USD', string $plan = 'premium'): array
    {
        // Accept either User or array for user info
        $clientName = '';
        $clientEmail = '';
        $clientPhone = '';
        $orderId = '';
        if ($user instanceof User) {
            $clientName = $user->name;
            $clientEmail = $user->email;
            $clientPhone = $user->phone ?? '';
            $orderId = 'ORDER_' . time() . '_' . $user->id;
        } elseif (is_array($user) && isset($user['email'])) {
            $clientName = ($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? '');
            $clientEmail = $user['email'];
            $clientPhone = $user['phone'] ?? '';
            $orderId = 'ORDER_' . time() . '_' . md5($clientEmail);
        } else {
            throw new \Exception('User or user_data required for payment link');
        }

        $courseName = $plan === 'basic' ? 'Basic Massage Course' : 'Premium Massage Course';

        $requestData = [
            'login' => $this->apiLogin,
            'order_id' => $orderId,
            'items' => [
                [
                    'name' => $courseName . ' $' . $amount,
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
            'client_name' => $clientName,
            'client_email' => $clientEmail,
            'client_phone' => $clientPhone,
            'client_tehudat' => '000000000',
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
                'amount' => $amount,
                'plan' => $plan
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