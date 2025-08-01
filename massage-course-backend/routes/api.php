<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CloudinaryController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use Illuminate\Support\Facades\Route;

use Illuminate\Http\Request;
use App\Services\EmailService;
use App\DTO\EmailDTO;


Route::post('test-email', function(Request $request) {
    $request->validate([
        'to' => 'required|email',
        'subject' => 'required|string',
        'templateVars' => 'nullable|array',
    ]);
    $emailDTO = new EmailDTO([
        'to' => $request->input('to'),
        'subject' => $request->input('subject'),
        'templateVars' => $request->input('templateVars', [])
    ]);
    app(EmailService::class)->sendEmail($emailDTO);
    return response()->json(['message' => 'Email sent']);
});

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot']);
    Route::post('/password/reset', [ForgotPasswordController::class, 'reset']);
});

Route::get('certificates/verify/{code}', [CertificateController::class, 'verify'])
    ->name('certificates.verify');

Route::post('webhooks/invoice4u', [PaymentController::class, 'handleWebhook'])
    ->name('api.webhooks.invoice4u');

Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0',
        'environment' => app()->environment()
    ]);
});

Route::get('course', function () {
    return response()->json([
        'title' => 'Professional Relaxation Massage Therapy Course',
        'description' => 'Master professional massage therapy techniques from basic foundations to advanced business practices.',
        'price' => 50.00,
        'currency' => 'ILS',
        'duration_hours' => 40,
        'difficulty_level' => 'beginner',
        'features' => [
            'Video lessons with expert instruction',
            'Downloadable resources and guides',
            'Interactive quizzes and assessments',
            'Professional certification upon completion',
            'Lifetime access to course materials',
            'Mobile-friendly learning platform'
        ],
        'modules_count' => 8,
        'lessons_count' => 35,
        'languages' => ['en', 'ru']
    ]);
});

Route::post('contact', [ContactController::class, 'store']);

Route::middleware(['api_auth'])->group(function () {
    
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });

    Route::prefix('modules')->group(function () {
        Route::get('/', [ModuleController::class, 'index']);
        Route::get('/{module}', [ModuleController::class, 'show']);
    });

    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('avatar', [ProfileController::class, 'updateAvatar']);
        Route::delete('avatar', [ProfileController::class, 'deleteAvatar']);
        Route::put('password', [ProfileController::class, 'updatePassword']);
        Route::get('statistics', [ProfileController::class, 'statistics']);
        Route::delete('account', [ProfileController::class, 'deleteAccount']);
    });

    Route::prefix('lessons')->group(function () {
        Route::get('/{lesson}', [LessonController::class, 'show']);
        Route::put('/{lesson}/progress', [LessonController::class, 'updateProgress']);
        Route::post('/{lesson}/complete', [LessonController::class, 'markCompleted']);
        Route::post('/{lesson}/quiz', [LessonController::class, 'submitQuiz']);
        Route::get('/{lesson}/notes', [LessonController::class, 'getNotes']);
        Route::put('/{lesson}/notes', [LessonController::class, 'updateNotes']);
    });

    Route::prefix('progress')->group(function () {
        Route::get('/', [ProgressController::class, 'index']);
        Route::get('/analytics', [ProgressController::class, 'analytics']);
        Route::get('/course', [ProgressController::class, 'courseProgress']);
        Route::get('/lesson/{lesson}', [ProgressController::class, 'lessonProgress']);
        Route::post('/reset', [ProgressController::class, 'reset']);
    });

    Route::prefix('certificates')->group(function () {
        Route::get('/', [CertificateController::class, 'index']);
        Route::get('/{certificate}', [CertificateController::class, 'show']);
        Route::get('/{certificate}/download', [CertificateController::class, 'download'])
            ->name('api.certificates.download');
        Route::post('/generate', [CertificateController::class, 'generate']);
        Route::get('/eligibility', [CertificateController::class, 'checkEligibility']);
    });

    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'show']);
        Route::put('/', [SettingsController::class, 'update']);
        Route::get('/notifications', [SettingsController::class, 'notifications']);
        Route::put('/notifications', [SettingsController::class, 'updateNotifications']);
        Route::get('/privacy', [SettingsController::class, 'privacy']);
        Route::put('/privacy', [SettingsController::class, 'updatePrivacy']);
        Route::get('/export', [SettingsController::class, 'exportData']);
    });

    Route::prefix('cloudinary')->group(function () {
        Route::get('/test', [CloudinaryController::class, 'testConnection']);
        Route::post('/upload', [CloudinaryController::class, 'uploadVideo']);
        Route::get('/lessons/{lesson}/metadata', [CloudinaryController::class, 'getVideoMetadata']);
        Route::delete('/lessons/{lesson}/video', [CloudinaryController::class, 'deleteVideo']);
        Route::get('/lessons/{lesson}/urls', [CloudinaryController::class, 'generateVideoUrls']);
    });
});

Route::prefix('payments')->group(function () {
    // Authenticated payment routes
    Route::get('/', [PaymentController::class, 'index']);
    Route::post('/intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/confirm', [PaymentController::class, 'confirmPayment']);
    Route::get('/access', [PaymentController::class, 'checkAccess']);
    Route::get('/test-connection', [PaymentController::class, 'testConnection']);
    
    // Payment specific routes (with route model binding)
    Route::get('/{payment}', [PaymentController::class, 'show']);
    Route::get('/{payment}/status', [PaymentController::class, 'getPaymentStatus']);
    Route::post('/{payment}/refund', [PaymentController::class, 'requestRefund']);
    
    // Webhook routes (no auth middleware - webhooks come from external services)
    Route::post('/allpay/webhook ', [PaymentController::class, 'handleAllpayWebhook']);
    
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/confirm', [PaymentController::class, 'confirmPayment']);
        Route::get('/access', [PaymentController::class, 'checkAccess']);
        Route::get('/test-connection', [PaymentController::class, 'testConnection']);
        Route::get('/{payment}', [PaymentController::class, 'show']);
        Route::get('/{payment}/status', [PaymentController::class, 'getPaymentStatus']);
        Route::get('/{payment}/invoice/download', [PaymentController::class, 'downloadInvoice']);
        Route::post('/{payment}/refund', [PaymentController::class, 'requestRefund']);
});

