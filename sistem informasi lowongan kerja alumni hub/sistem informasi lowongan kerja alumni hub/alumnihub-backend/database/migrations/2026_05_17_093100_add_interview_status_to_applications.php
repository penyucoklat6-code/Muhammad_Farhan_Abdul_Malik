<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Ubah enum status di tabel applications: tambah 'interview'
        DB::statement("ALTER TABLE applications MODIFY COLUMN status ENUM('dikirim', 'interview', 'diproses', 'diterima', 'ditolak') DEFAULT 'dikirim'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE applications MODIFY COLUMN status ENUM('dikirim', 'diproses', 'diterima', 'ditolak') DEFAULT 'dikirim'");
    }
};
