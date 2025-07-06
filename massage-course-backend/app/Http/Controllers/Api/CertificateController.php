<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Course;
use App\Models\UserCertificate;
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
            ->with(['course', 'certificate'])
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
            'certificate' => new CertificateResource($certificate->load(['course', 'certificate']))
        ]);
    }

    /**
     * Download certificate PDF.
     */
    public function download(UserCertificate $certificate, Request $request): Response
    {
        $this->authorize('view', $certificate);

        $pdfPath = $this->certificateService->getCertificatePath($certificate);
        
        if (!file_exists($pdfPath)) {
            // Regenerate certificate if file doesn't exist
            $pdfPath = $this->certificateService->generateCertificatePdf($certificate);
        }

        return response()->download($pdfPath, "certificate-{$certificate->certificate_number}.pdf");
    }

    /**
     * Generate certificate for completed course.
     */
    public function generate(Course $course, Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if user has completed the course
        if (!$user->hasCompletedCourse($course)) {
            return response()->json([
                'message' => 'Course must be completed before generating certificate'
            ], 400);
        }

        // Check if certificate already exists
        $existingCertificate = $user->certificates()
            ->where('course_id', $course->id)
            ->first();

        if ($existingCertificate) {
            return response()->json([
                'message' => 'Certificate already exists for this course',
                'certificate' => new CertificateResource($existingCertificate)
            ], 409);
        }

        // Generate new certificate
        $certificate = $this->certificateService->generateCertificate($user, $course);

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
            ->with(['user', 'course'])
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
                'course_title' => $certificate->course->title,
                'issued_at' => $certificate->issued_at->format('F j, Y'),
                'verification_code' => $certificate->verification_code
            ]
        ]);
    }
}
