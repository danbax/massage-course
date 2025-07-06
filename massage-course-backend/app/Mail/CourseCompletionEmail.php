<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Course;
use App\Models\UserCertificate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class CourseCompletionEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public User $user,
        public Course $course,
        public ?UserCertificate $certificate = null
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Congratulations! You've completed {$this->course->title}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.course-completion',
            with: [
                'user' => $this->user,
                'course' => $this->course,
                'certificate' => $this->certificate,
                'certificateUrl' => $this->certificate ? route('certificates.download', $this->certificate->id) : null,
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

        if ($this->certificate && $this->certificate->file_path) {
            $attachments[] = Attachment::fromStorage($this->certificate->file_path)
                ->as("Certificate_{$this->course->title}.pdf")
                ->withMime('application/pdf');
        }

        return $attachments;
    }
}
