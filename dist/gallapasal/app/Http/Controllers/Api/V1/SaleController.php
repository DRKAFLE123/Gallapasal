<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\StockLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with([
            'grain' => function ($q) {
                $q->select('id', 'name', 'unit_type');
            },
            'user' => function ($q) {
                $q->select('id', 'name');
            }
        ]);

        if ($request->has('from_date')) {
            $query->where('date_ad', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('date_ad', '<=', $request->to_date);
        }
        if ($request->has('grain_id')) {
            $query->where('grain_id', $request->grain_id);
        }
        if ($request->has('is_billed')) {
            $query->where('is_billed', (bool) $request->is_billed);
        }
        if ($request->has('customer_name')) {
            $query->where('customer_name', 'like', '%' . $request->customer_name . '%');
        }

        $perPage = $request->get('per_page', 50);
        return response()->json($query->orderBy('date_ad', 'desc')->orderBy('time', 'desc')->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date_bs' => 'required|string',
            'date_ad' => 'required|date',
            'time' => 'required|date_format:H:i',
            'customer_name' => 'required|string',
            'grain_id' => 'required|exists:grains,id',
            'quantity' => 'required|numeric|min:0.01',
            'rate' => 'required|numeric|min:0',
            'remarks' => 'nullable|string'
        ]);

        $validated['total_amount'] = round($validated['quantity'] * $validated['rate'], 2);
        $validated['created_by'] = $request->user()->id;

        DB::beginTransaction();
        try {
            $ledger = StockLedger::where('grain_id', $validated['grain_id'])->lockForUpdate()->first();

            if (!$ledger || $ledger->current_stock < $validated['quantity']) {
                DB::rollBack();
                return response()->json(['message' => 'Insufficient stock for this grain'], 422);
            }

            $sale = Sale::create($validated);

            // Update Stock Ledger (Reduces current stock, increases total sales qty)
            $ledger->update([
                'total_sales_qty' => $ledger->total_sales_qty + $validated['quantity'],
                'current_stock' => $ledger->current_stock - $validated['quantity'],
                'last_updated_at' => now()
            ]);

            DB::commit();
            return response()->json($sale->load('grain'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Sale entry failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Sale $sale)
    {
        return response()->json($sale->load('grain', 'user'));
    }

    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'date_bs' => 'required|string',
            'date_ad' => 'required|date',
            'time' => 'required|date_format:H:i',
            'customer_name' => 'required|string',
            'quantity' => 'required|numeric|min:0.01',
            'rate' => 'required|numeric|min:0',
            'remarks' => 'nullable|string'
        ]);

        $validated['total_amount'] = round($validated['quantity'] * $validated['rate'], 2);

        DB::beginTransaction();
        try {
            $ledger = StockLedger::where('grain_id', $sale->grain_id)->lockForUpdate()->first();

            // Calculate stock difference
            $qtyDifference = $validated['quantity'] - $sale->quantity;

            // Check if enough stock exists for the increase
            if ($qtyDifference > 0 && $ledger->current_stock < $qtyDifference) {
                DB::rollBack();
                return response()->json(['message' => 'Insufficient stock to increase this sale quantity'], 422);
            }

            $ledger->update([
                'total_sales_qty' => $ledger->total_sales_qty + $qtyDifference,
                'current_stock' => $ledger->current_stock - $qtyDifference,
                'last_updated_at' => now()
            ]);

            $sale->update($validated);

            DB::commit();
            return response()->json($sale->load('grain'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Sale update failed'], 500);
        }
    }

    public function destroy(Sale $sale)
    {
        DB::beginTransaction();
        try {
            $ledger = StockLedger::where('grain_id', $sale->grain_id)->lockForUpdate()->first();

            // Revert stock
            $ledger->update([
                'total_sales_qty' => $ledger->total_sales_qty - $sale->quantity,
                'current_stock' => $ledger->current_stock + $sale->quantity,
                'last_updated_at' => now()
            ]);

            $sale->delete();

            DB::commit();
            return response()->json(['message' => 'Sale deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Sale deletion failed'], 500);
        }
    }
}
