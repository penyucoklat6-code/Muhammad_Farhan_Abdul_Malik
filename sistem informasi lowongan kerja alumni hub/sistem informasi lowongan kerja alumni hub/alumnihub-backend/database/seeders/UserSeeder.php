<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Kaprodi
        User::create([
            'name'     => 'Dr. Ahmad Kaprodi',
            'email'    => 'kaprodi@alumnihub.test',
            'password' => Hash::make('password123'),
            'role'     => 'kaprodi',
        ]);

        // Mahasiswa 1
        User::create([
            'name'     => 'Budi Santoso',
            'email'    => 'budi@alumnihub.test',
            'password' => Hash::make('password123'),
            'role'     => 'mahasiswa',
        ]);

        // Mahasiswa 2
        User::create([
            'name'     => 'Siti Rahayu',
            'email'    => 'siti@alumnihub.test',
            'password' => Hash::make('password123'),
            'role'     => 'mahasiswa',
        ]);
    }
}
