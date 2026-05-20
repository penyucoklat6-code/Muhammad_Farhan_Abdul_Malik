<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('job_id')->constrained('jobs')->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();

            // 1 lowongan hanya bisa di-bookmark 1x oleh 1 user
            $table->unique(['user_id', 'job_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};
