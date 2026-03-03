<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Vendor;
use App\Models\VendorLedger;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchasePaymentController extends Controller
{
    /**
     * Record a payment against a specific purchase.
     * POST /purchases/{purchase}/record-payment
     */
    public function store(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:cash,bank,cheque',
            'date_bs' => 'required|string',
            'date_ad' => 'required|date',
        ]);

        $remaining = $purchase->total_amount - $purchase->paid_amount;

        if ($validated['amount'] > $remaining + 0.01) {
            return response()->json([
                'message' => "Payment of Rs. {$validated['amount']} exceeds the remaining balance of Rs. {$remaining}."
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Find or create Vendor record
            $vendor = Vendor::firstOrCreate(
                ['name' => $purchase->vendor_name],
                ['address' => null, 'phone' => null, 'vendor_type' => 'farmer']
            );

            // Record the payment
            $payment = Payment::create([
                'entity_type' => 'VENDOR',
                'entity_id' => $vendor->id,
                'date_bs' => $validated['date_bs'],
                'date_ad' => $validated['date_ad'],
                'amount' => $validated['amount'],
                'payment_method' => strtoupper($validated['payment_method']),
                'remarks' => 'Payment for purchase on ' . $purchase->date_bs,
                'created_by' => $request->user()->id,
            ]);

            // Post a DEBIT to Vendor Ledger (we paid them, so their balance reduces)
            VendorLedger::create([
                'vendor_id' => $vendor->id,
                'date_bs' => $validated['date_bs'],
                'date_ad' => $validated['date_ad'],
                'type' => 'DEBIT',
                'amount' => $validated['amount'],
                'reference_id' => 'PAY-' . $payment->id,
                'description' => 'Cash/Bank Payment for Purchase #' . $purchase->id,
            ]);
            $vendor->decrement('current_balance', $validated['amount']);

            // Update the purchase paid_amount
            $newPaid = $purchase->paid_amount + $validated['amount'];
            $purchase->update([
                'paid_amount' => $newPaid,
                'payment_method' => $validated['payment_method'],
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Payment recorded successfully.',
                'paid_amount' => $newPaid,
                'payment_status' => $this->deriveStatus($purchase->total_amount, $newPaid),
                'payment' => $payment,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Payment failed: ' . $e->getMessage()], 500);
        }
    }

    private function deriveStatus(float $total, float $paid): string
    {
        if ($paid <= 0)
            return 'unpaid';
        if ($paid >= $total)
            return 'fully_paid';
        return 'partially_paid';
    }
}
