<?php

namespace App\Console\Commands;

use App\Models\Course;
use App\Models\User;
use App\Models\UserProgress;
use App\Services\CertificateService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateCertificates extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'certificates:generate 
                            {--course= : Generate certificates for a specific course}
                            {--user= : Generate certificate for a specific user}
                            {--force : Force regenerate existing certificates}';

    /**
     * The console command description.
     */
    protected $description = 'Generate certificates for users who have completed courses';

    public function __construct(
        private CertificateService $certificateService
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting certificate generation...');

        $courseId = $this->option('course');
        $userId = $this->option('user');
        $force = $this->option('force');

        try {
            if ($userId && $courseId) {
                // Generate for specific user and course
                $this->generateForUserAndCourse($userId, $courseId, $force);
            } elseif ($userId) {
                // Generate for specific user (all completed courses)
                $this->generateForUser($userId, $force);
            } elseif ($courseId) {
                // Generate for specific course (all users who completed it)
                $this->generateForCourse($courseId, $force);
            } else {
                // Generate for all eligible users and courses
                $this->generateForAll($force);
            }

            $this->info('Certificate generation completed successfully!');
            return 0;
        } catch (\Exception $e) {
            $this->error('Certificate generation failed: ' . $e->getMessage());
            Log::error('Certificate generation command failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 1;
        }
    }

    /**
     * Generate certificate for specific user and course
     */
    private function generateForUserAndCourse(int $userId, int $courseId, bool $force): void
    {
        $user = User::find($userId);
        $course = Course::find($courseId);

        if (!$user) {
            throw new \Exception("User with ID {$userId} not found");
        }

        if (!$course) {
            throw new \Exception("Course with ID {$courseId} not found");
        }

        $progress = UserProgress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();

        if (!$progress || !$progress->is_completed) {
            $this->warn("User {$user->name} has not completed course {$course->title}");
            return;
        }

        if ($this->certificateService->hasCertificate($user, $course) && !$force) {
            $this->warn("Certificate already exists for user {$user->name} and course {$course->title}");
            return;
        }

        $certificate = $this->certificateService->generateCertificate($user, $course);
        $this->info("Generated certificate {$certificate->certificate_number} for {$user->name} - {$course->title}");
    }

    /**
     * Generate certificates for specific user
     */
    private function generateForUser(int $userId, bool $force): void
    {
        $user = User::find($userId);

        if (!$user) {
            throw new \Exception("User with ID {$userId} not found");
        }

        $completedCourses = UserProgress::where('user_id', $userId)
            ->where('is_completed', true)
            ->with('course')
            ->get();

        $this->info("Found {$completedCourses->count()} completed courses for user {$user->name}");

        foreach ($completedCourses as $progress) {
            if ($this->certificateService->hasCertificate($user, $progress->course) && !$force) {
                continue;
            }

            $certificate = $this->certificateService->generateCertificate($user, $progress->course);
            $this->info("Generated certificate {$certificate->certificate_number} for {$progress->course->title}");
        }
    }

    /**
     * Generate certificates for specific course
     */
    private function generateForCourse(int $courseId, bool $force): void
    {
        $course = Course::find($courseId);

        if (!$course) {
            throw new \Exception("Course with ID {$courseId} not found");
        }

        $completedUsers = UserProgress::where('course_id', $courseId)
            ->where('is_completed', true)
            ->with('user')
            ->get();

        $this->info("Found {$completedUsers->count()} users who completed course {$course->title}");

        foreach ($completedUsers as $progress) {
            if ($this->certificateService->hasCertificate($progress->user, $course) && !$force) {
                continue;
            }

            $certificate = $this->certificateService->generateCertificate($progress->user, $course);
            $this->info("Generated certificate {$certificate->certificate_number} for {$progress->user->name}");
        }
    }

    /**
     * Generate certificates for all eligible users and courses
     */
    private function generateForAll(bool $force): void
    {
        $this->info('Generating certificates for all eligible users...');

        $completedProgresses = UserProgress::where('is_completed', true)
            ->with(['user', 'course'])
            ->get();

        $generated = 0;
        $skipped = 0;

        foreach ($completedProgresses as $progress) {
            if ($this->certificateService->hasCertificate($progress->user, $progress->course) && !$force) {
                $skipped++;
                continue;
            }

            try {
                $certificate = $this->certificateService->generateCertificate($progress->user, $progress->course);
                $this->info("Generated certificate {$certificate->certificate_number} for {$progress->user->name} - {$progress->course->title}");
                $generated++;
            } catch (\Exception $e) {
                $this->error("Failed to generate certificate for {$progress->user->name} - {$progress->course->title}: " . $e->getMessage());
            }
        }

        $this->info("Generated {$generated} certificates, skipped {$skipped} existing certificates");
    }
}
