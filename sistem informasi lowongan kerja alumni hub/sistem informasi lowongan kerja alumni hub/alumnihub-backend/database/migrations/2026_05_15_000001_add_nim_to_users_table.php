<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom nim dan nip ke tabel users.
     * - nim : untuk mahasiswa — Nomor Induk Mahasiswa (numerik)
     * - nip : untuk kaprodi  — Nomor Induk Pegawai
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // NIM: numerik, max 20 digit, unik, hanya untuk mahasiswa (nullable)
            $table->string('nim', 20)->nullable()->unique()->after('name')
                  ->comment('Nomor Induk Mahasiswa (hanya mahasiswa)');

            // NIP: untuk kaprodi, unik, nullable
            $table->string('nip', 20)->nullable()->unique()->after('nim')
                  ->comment('Nomor Induk Pegawai (hanya kaprodi)');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nim', 'nip']);
        });
    }
};
