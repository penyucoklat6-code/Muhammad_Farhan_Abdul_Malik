<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('job_id')->constrained('jobs')->onDelete('cascade');
            $table->string('cv_path', 255);
            $table->string('portfolio_path', 255)->nullable();
            $table->enum('status', ['dikirim', 'diproses', 'diterima', 'ditolak'])
                  ->default('dikirim');
            $table->timestamp('applied_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            // 1 mahasiswa hanya bisa melamar 1x pada 1 lowongan
            $table->unique(['user_id', 'job_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
