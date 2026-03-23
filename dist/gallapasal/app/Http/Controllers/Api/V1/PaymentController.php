<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::query();

        if ($request->has('from_date')) {
            $query->where('date_ad', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('date_ad', '<=', $request->to_date);
        }
        if ($request->has('type')) {
            $query->where('type', $request->type); // PAYABLE or RECEIVABLE
        }
        if ($request->has('party_name')) {
            $query->where('party_name', 'like', '%' . $request->party_name . '%');
        }

        $payments = $query->orderBy('date_ad', 'desc')->paginate(50);

        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date_ad' => 'required|date',
            'date_bs' => 'required|string',
            'type' => 'required|in:PAYABLE,RECEIVABLE',
            'party_name' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'payment_mode' => 'required|string',
            'reference_no' => 'nullable|string',
            'remarks' => 'nullable|string'
        ]);

        $validated['created_by'] = $request->user()->id;

        $payment = Payment::create($validated);

        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        return response()->json($payment);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'date_ad' => 'required|date',
            'date_bs' => 'required|string',
            'type' => 'required|in:PAYABLE,RECEIVABLE',
            'party_name' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'payment_mode' => 'required|string',
            'reference_no' => 'nullable|string',
            'remarks' => 'nullable|string'
        ]);

        $payment->update($validated);

        return response()->json($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(['message' => 'Payment deleted']);
    }

    public function summary(Request $request)
    {
        $query = Payment::query();

        if ($request->has('from_date')) {
            $query->where('date_ad', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('date_ad', '<=', $request->to_date);
        }

        $payables = (clone $query)->where('type', 'PAYABLE')->sum('amount');
        $receivables = (clone $query)->where('type', 'RECEIVABLE')->sum('amount');

        return response()->json([
            'total_payables' => round($payables, 2),
            'total_receivables' => round($receivables, 2),
            'net_flow' => round($receivables - $payables, 2)
        ]);
    }
}
