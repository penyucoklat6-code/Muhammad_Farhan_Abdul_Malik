<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mitras', function (Blueprint $table) {
            $table->date('established_date')->nullable()->after('description');
            $table->text('address')->nullable()->after('established_date');
            $table->string('website_url')->nullable()->after('address');
        });
    }

    public function down(): void
    {
        Schema::table('mitras', function (Blueprint $table) {
            $table->dropColumn(['established_date', 'address', 'website_url']);
        });
    }
};
