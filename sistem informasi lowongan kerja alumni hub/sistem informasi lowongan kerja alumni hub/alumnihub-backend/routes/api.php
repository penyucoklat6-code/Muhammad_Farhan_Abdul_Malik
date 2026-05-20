<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\JobReviewController;
use App\Http\Controllers\Api\MajorController;
use App\Http\Controllers\Api\MitraController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RecycleBinController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\ChatController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — AlumniHub Career Portal
|--------------------------------------------------------------------------
| Prefix  : /api
| Auth    : Laravel Sanctum (Token-based)
| Roles   : mahasiswa | kaprodi
|--------------------------------------------------------------------------
*/

// ============================================================
// PUBLIC ROUTES (No Auth Required)
// ============================================================
Route::prefix('auth')->group(function () {
    Route::post('/register',    [AuthController::class, 'register']);
    Route::post('/verify-otp',  [AuthController::class, 'verifyOtp']);
    Route::post('/resend-otp',  [AuthController::class, 'resendOtp']);
    Route::post('/login',       [AuthController::class, 'login']);
});

// Lowongan published — bisa dilihat publik
Route::get('/jobs',      [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);

// Referensi data — publik
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/majors',     [MajorController::class, 'index']);
Route::get('/mitras',     [MitraController::class, 'index']);

// ============================================================
// AUTHENTICATED ROUTES (Sanctum + OTP Verified)
// ============================================================
Route::middleware(['auth:sanctum', 'otp.verified'])->group(function () {

    // ── Auth ──────────────────────────────────────────────
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // ── Profile ───────────────────────────────────────────
    Route::get('/profile',                   [ProfileController::class, 'index']);
    Route::post('/profile/biodata',          [ProfileController::class, 'updateBiodata']);
    Route::post('/profile/avatar',           [ProfileController::class, 'uploadAvatar']);
    Route::post('/profile/documents',        [ProfileController::class, 'addDocument']);
    Route::delete('/profile/documents/{id}', [ProfileController::class, 'deleteDocument']);
    Route::post('/profile/languages',        [ProfileController::class, 'addLanguage']);
    Route::delete('/profile/languages/{id}', [ProfileController::class, 'deleteLanguage']);

    // ── Notifications ──────────────────────────────────────
    Route::prefix('notifications')->group(function () {
        Route::get('/',              [NotificationController::class, 'index']);
        Route::put('/read-all',      [NotificationController::class, 'markAllAsRead']);
        Route::put('/{id}/read',     [NotificationController::class, 'markAsRead']);
        Route::delete('/{id}',       [NotificationController::class, 'destroy']);
    });

    // ── Jobs (Mahasiswa & Kaprodi bisa posting) ───────────
    Route::post('/jobs',          [JobController::class, 'store']);
    Route::put('/jobs/{id}',      [JobController::class, 'update']);
    Route::delete('/jobs/{id}',   [JobController::class, 'destroy']);
    Route::get('/my-jobs',        [JobController::class, 'myJobs']);

    // ── Applications ─────────────────────────────────────
    Route::get('/my-applications',                    [ApplicationController::class, 'myApplications']);
    Route::get('/jobs/{jobId}/applications',          [ApplicationController::class, 'jobApplications']);
    Route::put('/applications/{id}/status',           [ApplicationController::class, 'updateStatus']);

    // Hanya Mahasiswa yang bisa melamar
    Route::middleware('role:mahasiswa')->group(function () {
        Route::post('/applications/{jobId}', [ApplicationController::class, 'store']);
    });

    // ── Bookmarks (Mahasiswa) ─────────────────────────────
    Route::middleware('role:mahasiswa')->prefix('bookmarks')->group(function () {
        Route::get('/',          [BookmarkController::class, 'index']);
        Route::post('/{jobId}',  [BookmarkController::class, 'store']);
        Route::delete('/{jobId}',[BookmarkController::class, 'destroy']);
    });

    // ── Chat (Live Messaging) ─────────────────────────
    Route::prefix('chat')->group(function () {
        Route::get('/users',            [ChatController::class, 'getUsers']);
        Route::get('/messages/{userId}',[ChatController::class, 'getMessages']);
        Route::post('/send',            [ChatController::class, 'sendMessage']);
        Route::put('/read/{userId}',    [ChatController::class, 'markAsRead']);
        Route::get('/unread-count',     [ChatController::class, 'unreadCount']);
    });

    // ============================================================
    // KAPRODI-ONLY ROUTES
    // ============================================================
    Route::middleware('role:kaprodi')->group(function () {

        // ── Dashboard Overview ────────────────────────────
        Route::get('/kaprodi/overview', [\App\Http\Controllers\Api\KaprodiDashboardController::class, 'overview']);

        // ── Job Reviews ───────────────────────────────────
        Route::prefix('reviews')->group(function () {
            Route::get('/pending',   [JobReviewController::class, 'pending']);
            Route::get('/history',   [JobReviewController::class, 'history']);
            Route::get('/all-jobs',  [JobReviewController::class, 'allJobs']);
            Route::post('/{jobId}',  [JobReviewController::class, 'review']);
        });

        // ── Activity Logs ─────────────────────────────────
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);

        // ── Recycle Bin ───────────────────────────────────
        Route::prefix('recycle-bin')->group(function () {
            Route::get('/',              [RecycleBinController::class, 'index']);
            Route::post('/{id}/restore', [RecycleBinController::class, 'restore']);
            Route::delete('/{id}',       [RecycleBinController::class, 'permanentDelete']);
        });

        // ── Categories Management ─────────────────────────
        Route::post('/categories',         [CategoryController::class, 'store']);
        Route::put('/categories/{id}',     [CategoryController::class, 'update']);
        Route::delete('/categories/{id}',  [CategoryController::class, 'destroy']);

        // ── Majors Management ─────────────────────────────
        Route::post('/majors',         [MajorController::class, 'store']);
        Route::put('/majors/{id}',     [MajorController::class, 'update']);
        Route::delete('/majors/{id}',  [MajorController::class, 'destroy']);

        // ── Mitras Management ─────────────────────────────
        Route::post('/mitras',         [MitraController::class, 'store']);
        Route::put('/mitras/{id}',     [MitraController::class, 'update']);
        Route::delete('/mitras/{id}',  [MitraController::class, 'destroy']);
    });
});
