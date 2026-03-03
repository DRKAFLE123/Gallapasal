<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\StockLedger;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $todayAd = Carbon::today()->toDateString();

        $todayPurchases = Purchase::whereDate('date_ad', $todayAd)->sum('total_amount');
        $todaySales = Sale::whereDate('date_ad', $todayAd)->sum('total_amount');
        $totalStock = StockLedger::sum('current_stock');

        // Approximate profit calculation for today: (Sale Rate - Avg Purchase Rate) * Qty
        $todayProfit = 0;
        // Fetch all grain ledgers once to map avg costs and prevent N+1 queries in loop
        $ledgers = StockLedger::all()->keyBy('grain_id');

        $todayProfit = 0;
        $salesToday = Sale::whereDate('date_ad', $todayAd)->get();
        foreach ($salesToday as $sale) {
            $ledger = $ledgers->get($sale->grain_id);
            $avgCost = $ledger ? $ledger->avg_purchase_rate : 0;
            $todayProfit += ($sale->rate - $avgCost) * $sale->quantity;
        }

        // Fetch stock breakdown by grain
        $stockByGrain = StockLedger::with('grain:id,name,unit_type')
            ->where('current_stock', '>', 0)
            ->get()
            ->map(function ($ledger) {
                return [
                    'grain_name' => $ledger->grain->name,
                    'unit_type' => $ledger->grain->unit_type,
                    'current_stock' => $ledger->current_stock,
                ];
            });

        return response()->json([
            'today_purchases' => $todayPurchases,
            'today_sales' => $todaySales,
            'total_stock' => $totalStock,
            'today_profit' => $todayProfit,
            'stock_by_grain' => $stockByGrain
        ]);
    }
}
