<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class PaymentFailedException extends Exception
{
    protected $message = 'Payment processing failed.';
    protected $code = 400;

    protected $paymentProvider;
    protected $transactionId;
    protected $paymentMethod;

    public function __construct(
        string $message = null, 
        int $code = 400, 
        \Throwable $previous = null,
        string $paymentProvider = null,
        string $transactionId = null,
        string $paymentMethod = null
    ) {
        $this->message = $message ?? $this->message;
        $this->code = $code;
        $this->paymentProvider = $paymentProvider;
        $this->transactionId = $transactionId;
        $this->paymentMethod = $paymentMethod;
        
        parent::__construct($this->message, $this->code, $previous);
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(): JsonResponse
    {
        $response = [
            'message' => $this->getMessage(),
            'error' => 'payment_failed',
            'code' => $this->getCode(),
            'suggestions' => [
                'Check your payment method details',
                'Ensure sufficient funds are available',
                'Try a different payment method',
                'Contact your bank if the issue persists'
            ]
        ];

        if ($this->transactionId) {
            $response['transaction_id'] = $this->transactionId;
        }

        if ($this->paymentProvider) {
            $response['provider'] = $this->paymentProvider;
        }

        return response()->json($response, $this->getCode());
    }

    /**
     * Create exception for card declined
     */
    public static function cardDeclined(string $transactionId = null): self
    {
        return new self(
            "Your card was declined. Please check your card details and try again.",
            400,
            null,
            'stripe',
            $transactionId
        );
    }

    /**
     * Create exception for insufficient funds
     */
    public static function insufficientFunds(string $transactionId = null): self
    {
        return new self(
            "Insufficient funds. Please check your account balance and try again.",
            400,
            null,
            'stripe',
            $transactionId
        );
    }

    /**
     * Create exception for expired card
     */
    public static function cardExpired(string $transactionId = null): self
    {
        return new self(
            "Your card has expired. Please use a different card.",
            400,
            null,
            'stripe',
            $transactionId
        );
    }

    /**
     * Create exception for invalid card details
     */
    public static function invalidCard(string $transactionId = null): self
    {
        return new self(
            "Invalid card details. Please check your card information and try again.",
            400,
            null,
            'stripe',
            $transactionId
        );
    }

    /**
     * Create exception for provider error
     */
    public static function providerError(string $provider, string $errorMessage, string $transactionId = null): self
    {
        return new self(
            "Payment provider error: {$errorMessage}",
            502,
            null,
            $provider,
            $transactionId
        );
    }

    /**
     * Create exception for network/connection error
     */
    public static function networkError(string $provider = null): self
    {
        return new self(
            "Network error occurred while processing payment. Please try again.",
            503,
            null,
            $provider
        );
    }

    /**
     * Create exception for timeout
     */
    public static function timeout(string $provider = null, string $transactionId = null): self
    {
        return new self(
            "Payment processing timed out. Please try again.",
            408,
            null,
            $provider,
            $transactionId
        );
    }

    /**
     * Create exception for duplicate transaction
     */
    public static function duplicateTransaction(string $transactionId = null): self
    {
        return new self(
            "This transaction has already been processed.",
            409,
            null,
            null,
            $transactionId
        );
    }

    /**
     * Create exception for invalid amount
     */
    public static function invalidAmount(float $amount): self
    {
        return new self(
            "Invalid payment amount: {$amount}. Please check the course price.",
            400
        );
    }

    /**
     * Create exception for refund failure
     */
    public static function refundFailed(string $reason = null, string $transactionId = null): self
    {
        $message = "Refund processing failed";
        if ($reason) {
            $message .= ": {$reason}";
        }
        
        return new self($message, 400, null, null, $transactionId);
    }

    /**
     * Create exception for webhook verification failure
     */
    public static function webhookVerificationFailed(string $provider): self
    {
        return new self(
            "Webhook verification failed for {$provider}",
            400,
            null,
            $provider
        );
    }
}
