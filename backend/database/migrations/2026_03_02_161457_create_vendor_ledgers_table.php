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
        Schema::create('vendor_ledgers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->string('date_bs');
            $table->date('date_ad');
            $table->enum('type', ['CREDIT', 'DEBIT']); // CREDIT = we owe, DEBIT = we paid
            $table->decimal('amount', 15, 2);
            $table->string('reference_id')->nullable(); // Bill/Voucher ID
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_ledgers');
    }
};
