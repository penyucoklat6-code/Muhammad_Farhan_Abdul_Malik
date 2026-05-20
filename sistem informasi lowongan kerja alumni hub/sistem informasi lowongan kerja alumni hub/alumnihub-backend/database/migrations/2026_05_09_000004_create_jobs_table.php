<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title', 150);
            $table->text('description');
            $table->string('company', 150);
            $table->string('location', 150);
            $table->string('type', 50); // full-time, part-time, magang, dll
            $table->string('salary', 100)->nullable();
            $table->date('deadline')->nullable();
            $table->enum('status', ['pending', 'published', 'rejected', 'revision', 'closed'])
                  ->default('pending');
            $table->string('poster', 255)->nullable();
            $table->string('logo', 255)->nullable();
            $table->string('link_apply', 255)->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->foreignId('major_id')->nullable()->constrained('majors')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes(); // deleted_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
