<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Mail\OtpMail;
use App\Models\OtpVerification;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function __construct(private NotificationService $notifService) {}

    // ─────────────────────────────────────────────
    // POST /api/auth/register
    // ─────────────────────────────────────────────
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'nim'      => $request->role === 'mahasiswa' ? $request->nim : null,
            'nip'      => $request->role === 'kaprodi'  ? $request->nip : null,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        $otp = $this->generateAndSendOtp($user);

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil! Kode OTP telah dikirim ke email Anda.',
            'data'    => [
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'nim'   => $user->nim,
                    'nip'   => $user->nip,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
                'otp_expires_at' => $otp->expired_at,
            ],
        ], 201);
    }

    // ─────────────────────────────────────────────
    // POST /api/auth/verify-otp
    // ─────────────────────────────────────────────
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        $otp = $user->otpVerifications()
            ->where('otp_code', $request->otp_code)
            ->where('is_verified', 0)
            ->latest()
            ->first();

        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid.',
            ], 422);
        }

        if ($otp->isExpired()) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP sudah kedaluwarsa. Silakan minta OTP baru.',
                'code'    => 'OTP_EXPIRED',
            ], 422);
        }

        // Tandai OTP sebagai terverifikasi
        $otp->update(['is_verified' => 1]);

        // Buat token Sanctum
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi berhasil! Akun Anda telah aktif.',
            'data'    => [
                'token'      => $token,
                'token_type' => 'Bearer',
                'user'       => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ],
        ]);
    }

    // ─────────────────────────────────────────────
    // POST /api/auth/resend-otp
    // ─────────────────────────────────────────────
    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $user = User::where('email', $request->email)->first();

        // Cek apakah sudah terverifikasi
        if ($user->otpVerifications()->where('is_verified', 1)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Akun sudah terverifikasi.',
            ], 422);
        }

        // Cek rate-limit: jangan kirim terlalu sering (1 menit)
        $lastOtp = $user->latestOtp;
        if ($lastOtp && $lastOtp->created_at->diffInSeconds(now()) < 60) {
            return response()->json([
                'success' => false,
                'message' => 'Mohon tunggu 1 menit sebelum meminta OTP baru.',
            ], 429);
        }

        $otp = $this->generateAndSendOtp($user);

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP baru telah dikirim ke email Anda.',
            'data'    => ['otp_expires_at' => $otp->expired_at],
        ]);
    }

    // ─────────────────────────────────────────────
    // POST /api/auth/login
    // ─────────────────────────────────────────────
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Cek sudah verifikasi OTP
        if (!$user->otpVerifications()->where('is_verified', 1)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Akun belum diverifikasi. Silakan verifikasi OTP terlebih dahulu.',
                'code'    => 'OTP_NOT_VERIFIED',
            ], 403);
        }

        // Hapus token lama, buat yang baru
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'data'    => [
                'token'      => $token,
                'token_type' => 'Bearer',
                'user'       => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                ],
            ],
        ]);
    }

    // ─────────────────────────────────────────────
    // POST /api/auth/logout
    // ─────────────────────────────────────────────
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    // ─────────────────────────────────────────────
    // GET /api/auth/me
    // ─────────────────────────────────────────────
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'unread_notifications' => $user->notifications()->where('is_read', 0)->count(),
            ],
        ]);
    }

    // ─────────────────────────────────────────────
    // Private: Generate & Send OTP
    // ─────────────────────────────────────────────
    private function generateAndSendOtp(User $user): OtpVerification
    {
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $otp = OtpVerification::create([
            'user_id'    => $user->id,
            'otp_code'   => $code,
            'expired_at' => now()->addMinutes(10),
            'is_verified'=> 0,
        ]);

        try {
            Mail::to($user->email)->send(new OtpMail($user, $otp));
        } catch (\Throwable $e) {
            // Log error email tapi jangan crash — tampilkan OTP di log untuk debugging
            Log::error('Gagal mengirim email OTP: ' . $e->getMessage());
            Log::info('OTP untuk ' . $user->email . ' adalah: ' . $code . ' (berlaku 10 menit)');
        }

        return $otp;
    }
}
