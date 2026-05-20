<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->text('requirements')->nullable()->after('description');
            $table->decimal('salary_min', 15, 0)->nullable()->after('salary');
            $table->decimal('salary_max', 15, 0)->nullable()->after('salary_min');
            $table->string('external_link', 255)->nullable()->after('link_apply');
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['requirements', 'salary_min', 'salary_max', 'external_link']);
        });
    }
};
