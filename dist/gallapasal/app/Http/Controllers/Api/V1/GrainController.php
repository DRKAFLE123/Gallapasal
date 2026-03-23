<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Grain;
use App\Models\StockLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GrainController extends Controller
{
    public function index(Request $request)
    {
        $query = Grain::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:grains,name',
            'unit_type' => 'required|in:kg,quintal,ton',
            'is_active' => 'boolean'
        ]);

        DB::beginTransaction();
        try {
            $grain = Grain::create($validated);
            // Initialize stock ledger
            StockLedger::create([
                'grain_id' => $grain->id,
                'total_purchase_qty' => 0,
                'total_sales_qty' => 0,
                'current_stock' => 0,
                'avg_purchase_rate' => 0
            ]);
            DB::commit();
            return response()->json($grain, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create grain'], 500);
        }
    }

    public function show(Grain $grain)
    {
        return response()->json($grain);
    }

    public function update(Request $request, Grain $grain)
    {
        $validated = $request->validate([
            'name' => 'string|max:255|unique:grains,name,' . $grain->id,
            'unit_type' => 'in:kg,quintal,ton',
            'is_active' => 'boolean'
        ]);

        $grain->update($validated);
        return response()->json($grain);
    }

    public function destroy(Grain $grain)
    {
        $grain->update(['is_active' => !$grain->is_active]); // Toggle instead of hard delete
        return response()->json(['message' => 'Grain status updated', 'is_active' => $grain->is_active]);
    }
}
