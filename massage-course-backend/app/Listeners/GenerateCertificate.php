<?php

namespace App\Listeners;

use App\Events\CourseCompleted;
use App\Services\CertificateService;
use Illuminate\Support\Facades\Log;

class GenerateCertificate
{
    public function __construct(
        private CertificateService $certificateService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(CourseCompleted $event): void
    {
        try {
            // Generate certificate for the user
            $certificate = $this->certificateService->generateCertificate(
                $event->user,
                $event->course
            );
            
            Log::info('Certificate generated successfully', [
                'user_id' => $event->user->id,
                'course_id' => $event->course->id,
                'certificate_id' => $certificate->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to generate certificate', [
                'user_id' => $event->user->id,
                'course_id' => $event->course->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
