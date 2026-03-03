<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\BillController;
use App\Http\Controllers\Api\V1\PurchaseVoucherController;
use App\Http\Controllers\Api\V1\PurchasePaymentController;
use App\Http\Controllers\Api\V1\SystemController;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/user', [AuthController::class, 'user']);
        Route::post('/auth/user/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        Route::apiResource('grains', App\Http\Controllers\Api\V1\GrainController::class);
        Route::apiResource('purchases', App\Http\Controllers\Api\V1\PurchaseController::class);
        Route::apiResource('sales', App\Http\Controllers\Api\V1\SaleController::class);

        Route::get('/bills', [BillController::class, 'index']);
        Route::post('/bills/generate', [BillController::class, 'generateBill']);
        Route::get('/bills/{bill}', [BillController::class, 'show']);
        Route::get('/bills/{bill}/pdf', [BillController::class, 'exportPdf']);

        Route::get('/vouchers', [PurchaseVoucherController::class, 'index']);
        Route::get('/vouchers/summary', [PurchaseVoucherController::class, 'summary']);
        Route::post('/vouchers/generate', [PurchaseVoucherController::class, 'generate']);
        Route::get('/vouchers/{voucher}', [PurchaseVoucherController::class, 'show']);
        Route::get('/vouchers/{voucher}/pdf', [PurchaseVoucherController::class, 'exportPdf']);

        // Purchase Payments
        Route::post('/purchases/{purchase}/record-payment', [PurchasePaymentController::class, 'store']);

        // System
        Route::get('/system/backup', [SystemController::class, 'backup']);

        // Reports
        Route::get('/reports/stock', [App\Http\Controllers\Api\V1\ReportController::class, 'stockReport']);
        Route::get('/reports/purchases', [App\Http\Controllers\Api\V1\ReportController::class, 'purchaseReport']);
        Route::get('/reports/sales', [App\Http\Controllers\Api\V1\ReportController::class, 'salesReport']);
        Route::get('/reports/pnl', [App\Http\Controllers\Api\V1\ReportController::class, 'pnlReport']);

        // Expenses
        Route::get('/expenses/summary', [App\Http\Controllers\Api\V1\ExpenseController::class, 'summary']);
        Route::apiResource('expenses', App\Http\Controllers\Api\V1\ExpenseController::class);

        // Payments
        Route::get('/payments/summary', [App\Http\Controllers\Api\V1\PaymentController::class, 'summary']);
        Route::apiResource('payments', App\Http\Controllers\Api\V1\PaymentController::class);

        // Exports
        Route::get('/exports/purchases', [App\Http\Controllers\Api\V1\ExportController::class, 'exportPurchases']);
        Route::get('/exports/sales', [App\Http\Controllers\Api\V1\ExportController::class, 'exportSales']);
        Route::get('/exports/payments', [App\Http\Controllers\Api\V1\ExportController::class, 'exportPayments']);

        // System Settings
        Route::get('/system/backup', [App\Http\Controllers\Api\V1\BackupController::class, 'download']);
    });
});
