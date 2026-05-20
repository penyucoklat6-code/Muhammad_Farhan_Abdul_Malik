<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\OtpVerification;
use Illuminate\Support\Facades\Hash;

class KaprodiSeeder extends Seeder
{
    public function run(): void
    {
        // Buat atau update Kaprodi utama
        $user = User::updateOrCreate(
            ['email' => 'kaprodi@uhamka.ac.id'],
            [
                'name' => 'Kaprodi UHAMKA',
                'nip' => '123456789012345678',
                'password' => Hash::make('password123'),
                'role' => 'kaprodi',
            ]
        );

        // Buat verifikasi OTP secara otomatis agar tidak diblokir saat login
        if (!$user->otpVerifications()->where('is_verified', 1)->exists()) {
            OtpVerification::create([
                'user_id' => $user->id,
                'otp_code' => '000000',
                'expired_at' => now()->addYear(),
                'is_verified' => 1,
            ]);
        }

        $this->command->info('Akun Kaprodi default berhasil dibuat: kaprodi@uhamka.ac.id / password123');
    }
}
