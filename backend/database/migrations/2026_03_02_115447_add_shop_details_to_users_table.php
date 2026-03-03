<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('shop_name')->nullable()->after('password');
            $table->string('pan_number')->nullable()->after('shop_name');
            $table->string('registration_number')->nullable()->after('pan_number');
            $table->string('logo_path')->nullable()->after('registration_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['shop_name', 'pan_number', 'registration_number', 'logo_path']);
        });
    }
};
