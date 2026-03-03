<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $statements = [
            "CREATE INDEX purchases_vendor_name_index ON purchases (vendor_name)",
            "CREATE INDEX purchases_is_billed_index ON purchases (is_billed)",

            "CREATE INDEX sales_customer_name_index ON sales (customer_name)",
            "CREATE INDEX sales_is_billed_index ON sales (is_billed)",

            "CREATE INDEX purchase_vouchers_vendor_name_index ON purchase_vouchers (vendor_name)",
            "CREATE INDEX purchase_vouchers_vendor_type_index ON purchase_vouchers (vendor_type)",
            "CREATE INDEX purchase_vouchers_is_paid_index ON purchase_vouchers (is_paid)",

            "CREATE INDEX bills_customer_name_index ON bills (customer_name)",
            "CREATE INDEX expenses_expense_type_index ON expenses (expense_type)",
        ];

        foreach ($statements as $stmt) {
            try {
                DB::statement($stmt);
            } catch (\Exception $e) {
                // Ignore duplicate key errors (1061) silently
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $statements = [
            "ALTER TABLE purchases DROP INDEX purchases_vendor_name_index",
            "ALTER TABLE purchases DROP INDEX purchases_is_billed_index",

            "ALTER TABLE sales DROP INDEX sales_customer_name_index",
            "ALTER TABLE sales DROP INDEX sales_is_billed_index",

            "ALTER TABLE purchase_vouchers DROP INDEX purchase_vouchers_vendor_name_index",
            "ALTER TABLE purchase_vouchers DROP INDEX purchase_vouchers_vendor_type_index",
            "ALTER TABLE purchase_vouchers DROP INDEX purchase_vouchers_is_paid_index",

            "ALTER TABLE bills DROP INDEX bills_customer_name_index",
            "ALTER TABLE expenses DROP INDEX expenses_expense_type_index",
        ];

        foreach ($statements as $stmt) {
            try {
                DB::statement($stmt);
            } catch (\Exception $e) {
                // Ignore missing index errors
            }
        }
    }
};
