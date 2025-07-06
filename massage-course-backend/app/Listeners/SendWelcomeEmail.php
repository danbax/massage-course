<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendWelcomeEmail
{
    /**
     * Handle the event.
     */
    public function handle(UserRegistered $event): void
    {
        try {
            // Send welcome email to the new user
            Mail::to($event->user->email)->send(new WelcomeEmail($event->user));
            
            Log::info('Welcome email sent successfully', [
                'user_id' => $event->user->id,
                'email' => $event->user->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send welcome email', [
                'user_id' => $event->user->id,
                'email' => $event->user->email,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
