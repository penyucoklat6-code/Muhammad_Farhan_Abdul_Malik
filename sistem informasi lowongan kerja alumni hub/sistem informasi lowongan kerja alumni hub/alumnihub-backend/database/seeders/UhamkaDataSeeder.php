<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Major;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UhamkaDataSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Teknologi Informasi (IT) & Software',
            'Pendidikan & Pelatihan',
            'Kesehatan & Medis',
            'Keuangan & Akuntansi',
            'Pemasaran & Public Relations',
            'Penjualan (Sales) & Pengembangan Bisnis',
            'Administrasi & Dukungan Kantor',
            'Sumber Daya Manusia (HRD)',
            'Teknik & Manufaktur',
            'Layanan Pelanggan (Customer Service)',
            'Desain & Kreatif',
            'Logistik & Supply Chain',
            'Hukum & Kepatuhan',
            'Media & Jurnalisme'
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['name' => $cat]
            );
        }

        $majors = [
            // FKIP
            'Pendidikan Guru SD (PGSD)',
            'Pendidikan Guru PAUD',
            'Bimbingan dan Konseling',
            'Pendidikan Bahasa dan Sastra Indonesia',
            'Pendidikan Bahasa Inggris',
            'Pendidikan Sejarah',
            'Pendidikan Geografi',
            'Pendidikan Ekonomi',
            'Pendidikan Fisika',
            'Pendidikan Biologi',
            'Pendidikan Bahasa Jepang',
            
            // FEB
            'Manajemen',
            'Akuntansi',
            'Ekonomi Islam',
            'Perpajakan',
            
            // Teknik
            'Teknik Mesin',
            'Teknik Elektro',
            'Teknik Informatika',
            
            // FIKES
            'Ilmu Kesehatan Masyarakat',
            'Gizi',
            'Teknik Kardiovaskuler',
            
            // FISIP
            'Ilmu Komunikasi',
            
            // FFS
            'Farmasi',
            'Analis Kesehatan',
            
            // FAI
            'Pendidikan Agama Islam',
            'Perbankan Syariah',
            'Pendidikan Bahasa Arab',
            
            // Kedokteran & Psikologi
            'Ilmu Kedokteran',
            'Psikologi'
        ];

        foreach ($majors as $major) {
            Major::firstOrCreate(
                ['name' => $major]
            );
        }
    }
}
