<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('payments'); // Drop if the initial basic one existed
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->enum('entity_type', ['VENDOR', 'CUSTOMER']);
            $table->unsignedBigInteger('entity_id');
            $table->string('date_bs');
            $table->date('date_ad');
            $table->decimal('amount', 15, 2);
            $table->enum('payment_method', ['CASH', 'BANK', 'CHEQUE'])->default('CASH');
            $table->string('remarks')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
