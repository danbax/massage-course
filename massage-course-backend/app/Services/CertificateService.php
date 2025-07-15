<?php

namespace App\Services;

use App\Models\Course;
use App\Models\User;
use App\Models\UserCertificate;
use App\Models\Certificate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CertificateService
{
    /**
     * Generate certificate for a user who completed at least one lesson.
     */
    public function generateCertificate(User $user): UserCertificate
    {
        // For the massage course, we'll create a certificate without a specific course reference
        // Generate unique certificate number and verification code
        $certificateNumber = UserCertificate::generateCertificateNumber();
        $verificationCode = UserCertificate::generateVerificationCode();

        // Create certificate record (without course_id for now)
        $userCertificate = UserCertificate::create([
            'user_id' => $user->id,
            'certificate_id' => null, // We'll create the template on the fly
            'certificate_number' => $certificateNumber,
            'verification_code' => $verificationCode,
            'issued_at' => now()
        ]);

        return $userCertificate;
    }

    /**
     * Generate certificate for a user who completed a course (legacy method).
     */
    public function generateCertificateForCourse(User $user): UserCertificate
    {
        return $this->generateCertificate($user);
    }

    /**
     * Generate PDF file for certificate.
     */
    public function generateCertificatePdf(UserCertificate $userCertificate): string
    {
        $user = $userCertificate->user;
        $course = $userCertificate->course;
        $template = $userCertificate->certificate;

        // Prepare certificate data
        $data = [
            'user_name' => $user->name,
            'course_title' => $course->title,
            'certificate_number' => $userCertificate->certificate_number,
            'issued_date' => $userCertificate->issued_at->format('F j, Y'),
            'verification_code' => $userCertificate->verification_code,
            'instructor_name' => $course->instructor_name,
            'course_duration' => $course->duration_hours . ' hours',
            'completion_date' => $userCertificate->issued_at->format('F j, Y')
        ];

        // Generate HTML from template
        $html = $this->processTemplate($template->template_content, $data);

        // Generate PDF
        $pdf = Pdf::loadHTML($html)->setPaper('a4', 'landscape');
        
        // Create filename
        $filename = "certificate_{$userCertificate->certificate_number}.pdf";
        $path = "certificates/{$filename}";

        // Save PDF to storage
        Storage::disk('public')->put($path, $pdf->output());

        return $path;
    }

    /**
     * Get the full path to a certificate PDF.
     */
    public function getCertificatePath(UserCertificate $certificate): string
    {
        if ($certificate->file_path) {
            return Storage::disk('public')->path($certificate->file_path);
        }

        // Generate PDF if it doesn't exist
        return Storage::disk('public')->path($this->generateCertificatePdf($certificate));
    }

    /**
     * Process certificate template with data.
     */
    private function processTemplate(string $template, array $data): string
    {
        $html = $template;

        // Replace placeholders with actual data
        foreach ($data as $key => $value) {
            $html = str_replace("{{$key}}", $value, $html);
        }

        return $html;
    }

    /**
     * Create default certificate template for a course.
     */
    private function createDefaultTemplate(Course $course): Certificate
    {
        $defaultTemplate = '
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 40px; }
                .certificate { text-align: center; border: 10px solid #1e3d59; padding: 60px; }
                .title { font-size: 48px; color: #1e3d59; margin-bottom: 20px; }
                .subtitle { font-size: 24px; color: #666; margin-bottom: 40px; }
                .recipient { font-size: 36px; color: #1e3d59; margin: 30px 0; border-bottom: 2px solid #1e3d59; display: inline-block; padding-bottom: 10px; }
                .course { font-size: 28px; color: #333; margin: 20px 0; }
                .details { font-size: 16px; color: #666; margin-top: 40px; }
                .signature { margin-top: 60px; }
            </style>
        </head>
        <body>
            <div class="certificate">
                <h1 class="title">CERTIFICATE OF COMPLETION</h1>
                <p class="subtitle">This is to certify that</p>
                <div class="recipient">{user_name}</div>
                <p class="subtitle">has successfully completed the course</p>
                <div class="course">{course_title}</div>
                <div class="details">
                    <p>Course Duration: {course_duration}</p>
                    <p>Completion Date: {completion_date}</p>
                    <p>Certificate Number: {certificate_number}</p>
                    <p>Verification Code: {verification_code}</p>
                </div>
                <div class="signature">
                    <p>{instructor_name}<br>Course Instructor</p>
                    <p>Issued on {issued_date}</p>
                </div>
            </div>
        </body>
        </html>';

        return Certificate::create([
            'course_id' => $course->id,
            'title' => "Certificate for {$course->title}",
            'template_content' => $defaultTemplate,
            'is_active' => true
        ]);
    }

    /**
     * Verify certificate by verification code.
     */
    public function verifyCertificate(string $verificationCode): ?UserCertificate
    {
        return UserCertificate::where('verification_code', $verificationCode)
            ->with(['user', 'course'])
            ->first();
    }

    /**
     * Bulk generate certificates for completed courses.
     */
    public function bulkGenerateCertificates(): int
    {
        $generated = 0;

        // Find users who completed courses but don't have certificates
        $completedUsers = DB::table('user_progress')
            ->where('is_completed', true)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('user_certificates')
                    ->whereColumn('user_certificates.user_id', 'user_progress.user_id')
                    ->whereColumn('user_certificates.course_id', 'user_progress.course_id');
            })
            ->get();

        foreach ($completedUsers as $userProgress) {
            $user = User::find($userProgress->user_id);
            $course = Course::find($userProgress->course_id);

            if ($user && $course) {
                $this->generateCertificate($user, $course);
                $generated++;
            }
        }

        return $generated;
    }

    /**
     * Check if user already has a certificate for a course
     */
    public function hasCertificate(User $user, Course $course): bool
    {
        return UserCertificate::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();
    }
}
