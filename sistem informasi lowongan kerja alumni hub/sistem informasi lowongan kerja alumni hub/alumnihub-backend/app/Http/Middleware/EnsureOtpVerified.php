<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOtpVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Cek apakah user sudah verifikasi OTP
        $verified = $user->otpVerifications()
            ->where('is_verified', 1)
            ->exists();

        if (!$verified) {
            return response()->json([
                'success' => false,
                'message' => 'Akun belum diverifikasi. Silakan verifikasi OTP terlebih dahulu.',
                'code'    => 'OTP_NOT_VERIFIED',
            ], 403);
        }

        return $next($request);
    }
}
