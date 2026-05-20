<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    public function run(): void
    {
        $majors = [
            ['name' => 'Teknik Informatika'],
            ['name' => 'Sistem Informasi'],
            ['name' => 'Manajemen'],
            ['name' => 'Akuntansi'],
            ['name' => 'Pendidikan Matematika'],
            ['name' => 'Pendidikan Bahasa Inggris'],
            ['name' => 'Pendidikan Bahasa Indonesia'],
            ['name' => 'Ilmu Komunikasi'],
            ['name' => 'Farmasi'],
            ['name' => 'Kesehatan Masyarakat'],
            ['name' => 'Hukum'],
            ['name' => 'Psikologi'],
            ['name' => 'Teknik Elektro'],
            ['name' => 'Teknik Sipil'],
            ['name' => 'Ekonomi Pembangunan'],
        ];

        foreach ($majors as $major) {
            Major::create($major);
        }
    }
}
