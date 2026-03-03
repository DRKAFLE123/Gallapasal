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
        // Add customer details to bills
        Schema::table('bills', function (Blueprint $table) {
            $table->string('customer_name')->nullable()->after('bill_number');
            $table->string('customer_address')->nullable()->after('customer_name');
            $table->string('customer_phone')->nullable()->after('customer_address');
            $table->boolean('is_paid')->default(false)->after('total_amount');
        });

        // Swap purchase_id for sale_id in bill_items
        Schema::table('bill_items', function (Blueprint $table) {
            $table->dropForeign(['purchase_id']);
            $table->dropColumn('purchase_id');
            $table->foreignId('sale_id')->nullable()->after('bill_id')->constrained('sales')->onDelete('set null');
        });

        // Add is_billed flag to sales
        Schema::table('sales', function (Blueprint $table) {
            $table->boolean('is_billed')->default(false)->after('remarks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn('is_billed');
        });
        Schema::table('bill_items', function (Blueprint $table) {
            $table->dropForeign(['sale_id']);
            $table->dropColumn('sale_id');
            $table->foreignId('purchase_id')->nullable()->constrained('purchases')->onDelete('set null');
        });
        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'customer_address', 'customer_phone', 'is_paid']);
        });
    }
};
