<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('gender', ['Laki-laki', 'Perempuan'])->nullable()->after('email');
            $table->string('phone', 20)->nullable()->after('gender');
            $table->text('address')->nullable()->after('phone');
            $table->text('domicile_address')->nullable()->after('address');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['gender', 'phone', 'address', 'domicile_address']);
        });
    }
};
