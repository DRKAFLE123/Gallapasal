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
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['type', 'party_name', 'reference_no']);
            $table->enum('entity_type', ['VENDOR', 'CUSTOMER'])->after('id')->default('VENDOR');
            $table->unsignedBigInteger('entity_id')->after('entity_type')->default(0);

            $table->index(['entity_type', 'entity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['entity_type', 'entity_id']);
            $table->dropColumn(['entity_type', 'entity_id']);
            $table->enum('type', ['PAYABLE', 'RECEIVABLE'])->default('PAYABLE');
            $table->string('party_name')->default('');
            $table->string('reference_no')->nullable();
        });
    }
};
