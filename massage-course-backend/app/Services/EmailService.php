<?php
namespace App\Services;

use App\DTO\EmailDTO;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Log;

class EmailService
{
    public function sendEmail(EmailDTO $emailData): void
    {
        $template = View::make('emails.password_reset', $emailData->templateVars)->render();

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.mailgun.net/v3/massagecourse.academy/messages',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => [
                'from' => 'Massage Academy <no-reply@massagecourse.academy>',
                'to' => $emailData->to,
                'subject' => $emailData->subject,
                'html' => $template
            ],
            CURLOPT_HTTPHEADER => [
                'Authorization: Basic YXBpOjQ2Y2QzYmM2ODZhNzI1MWM0Yjg3ZGZiZjEzZmZjYjVhLTE4MTQ0OWFhLWVjN2I3MDVj'
            ],
        ]);

        $response = curl_exec($curl);
        Log::info('Email sent', [
            'to' => $emailData->to,
            'subject' => $emailData->subject,
            'response' => $response
        ]);

        curl_close($curl);

    }
}
