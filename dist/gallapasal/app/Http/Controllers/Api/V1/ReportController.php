<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\StockLedger;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // 1. Stock Report
    public function stockReport(Request $request)
    {
        $query = StockLedger::with([
            'grain' => function ($q) {
                $q->select('id', 'name', 'unit_type');
            }
        ]);

        if ($request->has('grain_id')) {
            $query->where('grain_id', $request->grain_id);
        }

        // We only show items that have been purchased or sold at least once
        $query->where(function ($q) {
            $q->where('total_purchase_qty', '>', 0)
                ->orWhere('total_sales_qty', '>', 0);
        });

        // Add calculated stock valuation (Current Stock * Avg Purchase Rate)
        $ledgers = $query->get()->map(function ($ledger) {
            $ledger->stock_value = round($ledger->current_stock * $ledger->avg_purchase_rate, 2);
            return $ledger;
        });

        return response()->json($ledgers);
    }

    // 2. Purchase Report (Summary)
    public function purchaseReport(Request $request)
    {
        $query = Purchase::with([
            'grain' => function ($q) {
                $q->select('id', 'name');
            }
        ]);

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('date_ad', [$request->from_date, $request->to_date]);
        }

        if ($request->has('grain_id')) {
            $query->where('grain_id', $request->grain_id);
        }

        if ($request->has('vendor_name')) {
            $query->where('vendor_name', 'like', '%' . $request->vendor_name . '%');
        }

        $purchases = $query->orderBy('date_ad', 'desc')->get();

        $summary = [
            'total_quantity' => $purchases->sum('quantity'),
            'total_amount' => round($purchases->sum('total_amount'), 2),
            'count' => $purchases->count()
        ];

        return response()->json([
            'summary' => $summary,
            'data' => $purchases
        ]);
    }

    // 3. Sales Report (Summary)
    public function salesReport(Request $request)
    {
        $query = Sale::with([
            'grain' => function ($q) {
                $q->select('id', 'name');
            }
        ]);

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('date_ad', [$request->from_date, $request->to_date]);
        }

        if ($request->has('grain_id')) {
            $query->where('grain_id', $request->grain_id);
        }

        if ($request->has('customer_name')) {
            $query->where('customer_name', 'like', '%' . $request->customer_name . '%');
        }

        $sales = $query->orderBy('date_ad', 'desc')->get();

        $summary = [
            'total_quantity' => $sales->sum('quantity'),
            'total_amount' => round($sales->sum('total_amount'), 2),
            'count' => $sales->count()
        ];

        return response()->json([
            'summary' => $summary,
            'data' => $sales
        ]);
    }

    // 4. Profit & Loss Report
    public function pnlReport(Request $request)
    {
        $query = Sale::with([
            'grain' => function ($q) {
                $q->select('id', 'name');
            }
        ]);

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('date_ad', [$request->from_date, $request->to_date]);
        }

        $sales = $query->get();
        // Load stock ledger to get current average purchase rate for profit calculation
        $stockLedgers = StockLedger::all()->keyBy('grain_id');

        $pnlData = $sales->map(function ($sale) use ($stockLedgers) {
            $ledger = $stockLedgers->get($sale->grain_id);
            $avgCost = $ledger ? $ledger->avg_purchase_rate : 0;

            $costAmount = $sale->quantity * $avgCost;
            $revenueAmount = $sale->total_amount;
            $profit = $revenueAmount - $costAmount;

            return [
                'id' => $sale->id,
                'date_ad' => $sale->date_ad->format('Y-m-d'),
                'date_bs' => $sale->date_bs,
                'grain_name' => collect($sale->grain)->get('name'),
                'customer_name' => $sale->customer_name,
                'quantity' => $sale->quantity,
                'sale_rate' => $sale->rate,
                'avg_cost_rate' => $avgCost,
                'revenue' => round($revenueAmount, 2),
                'cost' => round($costAmount, 2),
                'profit' => round($profit, 2)
            ];
        });

        $summary = [
            'total_revenue' => round($pnlData->sum('revenue'), 2),
            'total_cost' => round($pnlData->sum('cost'), 2),
            'net_profit' => round($pnlData->sum('profit'), 2)
        ];

        return response()->json([
            'summary' => $summary,
            'data' => $pnlData->sortByDesc('date_ad')->values()->all()
        ]);
    }
}
