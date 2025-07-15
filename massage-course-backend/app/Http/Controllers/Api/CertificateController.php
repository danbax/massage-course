<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\UserCertificate;
use App\Models\Certificate;
use App\Services\CertificateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CertificateController extends Controller
{
    public function __construct(
        private CertificateService $certificateService
    ) {}

    /**
     * Get user's certificates.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $certificates = $user->certificates()
            ->with('certificate')
            ->orderBy('issued_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'certificates' => CertificateResource::collection($certificates->items()),
            'meta' => [
                'current_page' => $certificates->currentPage(),
                'last_page' => $certificates->lastPage(),
                'per_page' => $certificates->perPage(),
                'total' => $certificates->total()
            ]
        ]);
    }

    /**
     * Show specific certificate.
     */
    public function show(UserCertificate $certificate, Request $request): JsonResponse
    {
        $this->authorize('view', $certificate);

        return response()->json([
            'certificate' => new CertificateResource($certificate->load('certificate'))
        ]);
    }

    /**
     * Download certificate PDF.
     */
    public function download(UserCertificate $certificate, Request $request): JsonResponse
    {
        $this->authorize('download', $certificate);

        // For now, return a simple response indicating PDF generation is not implemented
        // The frontend will handle PDF generation using jsPDF
        return response()->json([
            'message' => 'PDF generation handled by frontend',
            'certificate' => new CertificateResource($certificate)
        ]);
    }

    /**
     * Generate certificate for completed course.
     */
    public function generate(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if user has completed at least one lesson
        if (!$user->hasCompletedAtLeastOneLesson()) {
            return response()->json([
                'message' => 'At least one lesson must be completed before generating certificate'
            ], 400);
        }

        // Check if certificate already exists
        $existingCertificate = $user->certificates()->first();

        if ($existingCertificate) {
            return response()->json([
                'message' => 'Certificate already exists',
                'certificate' => new CertificateResource($existingCertificate)
            ], 200);
        }

        // Generate new certificate
        $certificate = $this->certificateService->generateCertificate($user);

        return response()->json([
            'message' => 'Certificate generated successfully',
            'certificate' => new CertificateResource($certificate)
        ], 201);
    }

    /**
     * Verify certificate by code (public endpoint).
     */
    public function verify(string $code): JsonResponse
    {
        $certificate = UserCertificate::where('verification_code', $code)
            ->with('user')
            ->first();

        if (!$certificate) {
            return response()->json([
                'message' => 'Certificate not found',
                'valid' => false
            ], 404);
        }

        return response()->json([
            'message' => 'Certificate is valid',
            'valid' => true,
            'certificate' => [
                'certificate_number' => $certificate->certificate_number,
                'recipient_name' => $certificate->user->name,
                'course_title' => 'Professional Relaxation Massage Therapy Course',
                'issued_at' => $certificate->issued_at->format('F j, Y'),
                'verification_code' => $certificate->verification_code
            ]
        ]);
    }

    /**
     * Check if user is eligible for certificate.
     */
    public function checkEligibility(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $hasCompleted = $user->hasCompletedAtLeastOneLesson();
        $hasExisting = $user->certificates()->exists();
        
        return response()->json([
            'eligible' => $hasCompleted && !$hasExisting,
            'completed_lesson' => $hasCompleted,
            'has_certificate' => $hasExisting,
            'message' => $this->getEligibilityMessage($hasCompleted, $hasExisting)
        ]);
    }

    /**
     * Get eligibility message.
     */
    private function getEligibilityMessage(bool $hasCompleted, bool $hasExisting): string
    {
        if ($hasExisting) {
            return 'Certificate already issued';
        }
        
        if (!$hasCompleted) {
            return 'Complete at least one lesson to earn your certificate';
        }
        
        return 'Eligible for certificate generation';
    }
}