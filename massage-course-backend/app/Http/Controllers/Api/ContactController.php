<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Handle contact form submission.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'type' => 'required|string|in:general,technical,billing,course,bug,feature',
            'message' => 'required|string|min:10|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        try {
            // Send email to support
            $this->sendSupportEmail($data);

            // Log the contact request
            Log::info('Contact form submitted', [
                'name' => $data['name'],
                'email' => $data['email'],
                'type' => $data['type'],
                'subject' => $data['subject'],
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'message' => 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
                'data' => [
                    'reference_id' => 'MSG-' . strtoupper(substr(md5($data['email'] . time()), 0, 8))
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send contact email', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return response()->json([
                'message' => 'Failed to send message. Please try again or contact us directly at danik.bachnov@gmail.com',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Send support email.
     */
    private function sendSupportEmail(array $data): void
    {
        $supportEmail = 'danik.bachnov@gmail.com';
        
        $subject = "[Massage Academy Support] {$data['subject']} - {$this->getSupportTypeLabel($data['type'])}";
        
        $emailContent = $this->buildEmailContent($data);

        // Using Laravel's Mail facade with raw content
        Mail::raw($emailContent, function ($message) use ($supportEmail, $subject, $data) {
            $message->to($supportEmail)
                   ->subject($subject)
                   ->replyTo($data['email'], $data['name']);
        });
    }

    /**
     * Build email content.
     */
    private function buildEmailContent(array $data): string
    {
        $typeLabel = $this->getSupportTypeLabel($data['type']);
        $timestamp = now()->format('Y-m-d H:i:s T');

        return "
Support Request Details
======================

Name: {$data['name']}
Email: {$data['email']}
Support Type: {$typeLabel}
Subject: {$data['subject']}
Submitted: {$timestamp}

Message:
--------
{$data['message']}

======================
This message was sent through the Massage Academy contact form.
Reply directly to this email to respond to the user.
        ";
    }

    /**
     * Get support type label.
     */
    private function getSupportTypeLabel(string $type): string
    {
        $labels = [
            'general' => 'General Question',
            'technical' => 'Technical Support',
            'billing' => 'Billing & Payment',
            'course' => 'Course Content',
            'bug' => 'Bug Report',
            'feature' => 'Feature Request'
        ];

        return $labels[$type] ?? 'General';
    }
}
