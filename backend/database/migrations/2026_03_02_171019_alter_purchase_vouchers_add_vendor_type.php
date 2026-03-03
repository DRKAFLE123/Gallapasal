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
        Schema::table('purchase_vouchers', function (Blueprint $table) {
            $table->enum('vendor_type', ['farmer', 'trader', 'vat_vendor', 'unregistered_vendor'])
                ->default('farmer')
                ->after('vendor_address');
            $table->boolean('is_paid')->default(false)->after('total_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_vouchers', function (Blueprint $table) {
            $table->dropColumn(['vendor_type', 'is_paid']);
        });
    }
};
