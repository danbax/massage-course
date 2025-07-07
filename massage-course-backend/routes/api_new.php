<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

// Protected routes (all users automatically get access to the single course)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });

    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('avatar', [ProfileController::class, 'updateAvatar']);
        Route::delete('avatar', [ProfileController::class, 'deleteAvatar']);
        Route::put('password', [ProfileController::class, 'updatePassword']);
    });

    // Module routes (single course system)
    Route::prefix('modules')->group(function () {
        Route::get('/', [ModuleController::class, 'index']); // Get all modules with lessons and progress
        Route::get('/{module}', [ModuleController::class, 'show']); // Get specific module
    });

    // Lesson routes
    Route::prefix('lessons')->group(function () {
        Route::get('/{lesson}', [LessonController::class, 'show']);
        Route::put('/{lesson}/progress', [LessonController::class, 'updateProgress']);
        Route::post('/{lesson}/complete', [LessonController::class, 'markCompleted']);
        Route::post('/{lesson}/quiz', [LessonController::class, 'submitQuiz']);
        Route::get('/{lesson}/notes', [LessonController::class, 'getNotes']);
        Route::put('/{lesson}/notes', [LessonController::class, 'updateNotes']);
    });

    // Progress routes
    Route::prefix('progress')->group(function () {
        Route::get('/', [ProgressController::class, 'index']);
        Route::get('/analytics', [ProgressController::class, 'analytics']);
        Route::get('/lesson/{lesson}', [ProgressController::class, 'lessonProgress']);
    });

    // Certificate routes
    Route::prefix('certificates')->group(function () {
        Route::get('/', [CertificateController::class, 'index']);
        Route::get('/{certificate}', [CertificateController::class, 'show']);
        Route::get('/{certificate}/download', [CertificateController::class, 'download']);
        Route::post('/generate', [CertificateController::class, 'generate']); // Generate for the single course
    });

    // Payment routes (optional - for premium features)
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/intent', [PaymentController::class, 'createPaymentIntent']);
        Route::post('/confirm', [PaymentController::class, 'confirmPayment']);
        Route::get('/{payment}', [PaymentController::class, 'show']);
    });

    // Settings routes
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'show']);
        Route::put('/', [SettingsController::class, 'update']);
        Route::get('/notifications', [SettingsController::class, 'notifications']);
        Route::put('/notifications', [SettingsController::class, 'updateNotifications']);
    });
});

// Public certificate verification
Route::get('certificates/verify/{code}', [CertificateController::class, 'verify'])->name('certificates.verify');

// Stripe webhooks (unprotected)
Route::post('webhooks/stripe', [PaymentController::class, 'handleWebhook']);

// Health check
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'message' => 'Massage Course API is running (Single Course System)'
    ]);
});
