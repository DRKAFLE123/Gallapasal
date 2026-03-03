<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::query();

        if ($request->has('from_date')) {
            $query->where('date_ad', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('date_ad', '<=', $request->to_date);
        }
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $expenses = $query->orderBy('date_ad', 'desc')->paginate(50);

        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date_ad' => 'required|date',
            'date_bs' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0.01'
        ]);

        $validated['created_by'] = $request->user()->id;

        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    public function show(Expense $expense)
    {
        return response()->json($expense);
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'date_ad' => 'required|date',
            'date_bs' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0.01'
        ]);

        $expense->update($validated);

        return response()->json($expense);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(['message' => 'Expense deleted']);
    }

    public function summary(Request $request)
    {
        $query = Expense::query();

        if ($request->has('from_date')) {
            $query->where('date_ad', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('date_ad', '<=', $request->to_date);
        }

        $total = $query->sum('amount');

        $byCategory = $query->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->get();

        return response()->json([
            'total_expenses' => round($total, 2),
            'by_category' => $byCategory
        ]);
    }
}
