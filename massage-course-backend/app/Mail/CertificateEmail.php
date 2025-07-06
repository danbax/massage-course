<?php

namespace App\Mail;

use App\Models\User;
use App\Models\UserCertificate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class CertificateEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public User $user,
        public UserCertificate $certificate
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Certificate is Ready!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.certificate',
            with: [
                'user' => $this->user,
                'certificate' => $this->certificate,
                'downloadUrl' => route('certificates.download', $this->certificate->id),
                'verifyUrl' => route('certificates.verify', $this->certificate->certificate_number),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        if ($this->certificate->file_path) {
            $attachments[] = Attachment::fromStorage($this->certificate->file_path)
                ->as("Certificate_{$this->certificate->certificate_number}.pdf")
                ->withMime('application/pdf');
        }

        return $attachments;
    }
}
