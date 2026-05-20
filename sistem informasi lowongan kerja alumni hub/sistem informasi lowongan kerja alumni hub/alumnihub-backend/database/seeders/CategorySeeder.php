<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Teknologi Informasi', 'description' => 'Bidang IT, software, hardware, dan digital'],
            ['name' => 'Pendidikan',           'description' => 'Guru, dosen, tutor, dan tenaga pendidik'],
            ['name' => 'Kesehatan',            'description' => 'Medis, farmasi, dan kesehatan masyarakat'],
            ['name' => 'Keuangan & Akuntansi', 'description' => 'Akuntan, auditor, analis keuangan'],
            ['name' => 'Marketing & Sales',    'description' => 'Pemasaran, penjualan, dan hubungan pelanggan'],
            ['name' => 'Desain & Kreatif',     'description' => 'Desainer grafis, UI/UX, multimedia'],
            ['name' => 'Hukum',                'description' => 'Pengacara, notaris, konsultan hukum'],
            ['name' => 'Teknik & Manufaktur',  'description' => 'Insinyur, teknisi, dan produksi'],
            ['name' => 'Komunikasi & Media',   'description' => 'Jurnalis, PR, penyiaran, dan media sosial'],
            ['name' => 'Administrasi & HRD',   'description' => 'Admin, SDM, sekretaris, dan perkantoran'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
