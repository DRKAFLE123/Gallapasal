<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\StockLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::with([
            'grain' => function ($q) {
                $q->select('id', 'name', 'unit_type');
            },
            'user' => function ($q) {
                $q->select('id', 'name');
            }
        ]);

        // Date range filtering (BS or AD can be expanded here)
        if ($request->has('from_date')) {
            $query->where('date_ad', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('date_ad', '<=', $request->to_date);
        }
        if ($request->has('grain_id')) {
            $query->where('grain_id', $request->grain_id);
        }

        return response()->json($query->orderBy('date_ad', 'desc')->orderBy('time', 'desc')->paginate(50));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date_bs' => 'required|string',
            'date_ad' => 'required|date',
            'time' => 'required|date_format:H:i',
            'vendor_name' => 'nullable|string',
            'grain_id' => 'required|exists:grains,id',
            'quantity' => 'required|numeric|min:0.01',
            'rate' => 'required|numeric|min:0',
            'remarks' => 'nullable|string'
        ]);

        $validated['vendor_name'] = $validated['vendor_name'] ?: 'Farmer';
        $validated['total_amount'] = round($validated['quantity'] * $validated['rate'], 2);
        $validated['created_by'] = $request->user()->id;
        $validated['is_billed'] = false;

        DB::beginTransaction();
        try {
            $purchase = Purchase::create($validated);

            // Update Stock Ledger
            $ledger = StockLedger::firstOrCreate(
                ['grain_id' => $validated['grain_id']],
                ['total_purchase_qty' => 0, 'total_sales_qty' => 0, 'current_stock' => 0, 'avg_purchase_rate' => 0]
            );

            // Calculate new weighted avg rate
            $oldTotalValue = $ledger->total_purchase_qty * $ledger->avg_purchase_rate;
            $newPurchaseValue = $validated['total_amount'];
            $newTotalQty = $ledger->total_purchase_qty + $validated['quantity'];

            $newAvgRate = $newTotalQty > 0 ? ($oldTotalValue + $newPurchaseValue) / $newTotalQty : 0;

            $ledger->update([
                'total_purchase_qty' => $newTotalQty,
                'current_stock' => $ledger->current_stock + $validated['quantity'],
                'avg_purchase_rate' => round($newAvgRate, 2),
                'last_updated_at' => now()
            ]);

            DB::commit();

            return response()->json($purchase->load('grain'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Purchase entry failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Purchase $purchase)
    {
        return response()->json($purchase->load('grain', 'user'));
    }

    public function update(Request $request, Purchase $purchase)
    {
        if ($purchase->is_billed) {
            return response()->json(['message' => 'Cannot edit a billed purchase'], 422);
        }

        $validated = $request->validate([
            'date_bs' => 'required|string',
            'date_ad' => 'required|date',
            'time' => 'required|date_format:H:i',
            'vendor_name' => 'nullable|string',
            'quantity' => 'required|numeric|min:0.01',
            'rate' => 'required|numeric|min:0',
            'remarks' => 'nullable|string'
        ]);

        $validated['vendor_name'] = $validated['vendor_name'] ?: 'Farmer';
        $validated['total_amount'] = round($validated['quantity'] * $validated['rate'], 2);

        DB::beginTransaction();
        try {
            // Revert old stock values
            $ledger = StockLedger::where('grain_id', $purchase->grain_id)->first();

            $oldQty = $purchase->quantity;
            $oldValue = $oldQty * $purchase->rate;

            $currentTotalValue = $ledger->total_purchase_qty * $ledger->avg_purchase_rate;

            $newTotalQty = $ledger->total_purchase_qty - $oldQty + $validated['quantity'];
            $newTotalValue = $currentTotalValue - $oldValue + $validated['total_amount'];

            $newAvgRate = $newTotalQty > 0 ? $newTotalValue / $newTotalQty : 0;

            $ledger->update([
                'total_purchase_qty' => $newTotalQty,
                'current_stock' => $ledger->current_stock - $oldQty + $validated['quantity'],
                'avg_purchase_rate' => round($newAvgRate, 2),
                'last_updated_at' => now()
            ]);

            $purchase->update($validated);

            DB::commit();
            return response()->json($purchase->load('grain'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Purchase update failed'], 500);
        }
    }

    public function destroy(Purchase $purchase)
    {
        if ($purchase->is_billed) {
            return response()->json(['message' => 'Cannot delete a billed purchase'], 422);
        }

        DB::beginTransaction();
        try {
            $ledger = StockLedger::where('grain_id', $purchase->grain_id)->first();

            // Revert stock
            $oldQty = $purchase->quantity;
            $oldValue = $purchase->total_amount;
            $currentTotalValue = $ledger->total_purchase_qty * $ledger->avg_purchase_rate;

            $newTotalQty = $ledger->total_purchase_qty - $oldQty;
            $newTotalValue = $currentTotalValue - $oldValue;

            $newAvgRate = $newTotalQty > 0 ? $newTotalValue / $newTotalQty : 0;

            $ledger->update([
                'total_purchase_qty' => $newTotalQty,
                'current_stock' => $ledger->current_stock - $oldQty,
                'avg_purchase_rate' => round($newAvgRate, 2),
                'last_updated_at' => now()
            ]);

            $purchase->delete();

            DB::commit();
            return response()->json(['message' => 'Purchase deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Purchase deletion failed'], 500);
        }
    }
}
