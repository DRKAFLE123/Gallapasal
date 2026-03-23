<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BillItem;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Payment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BillController extends Controller
{
    public function index(Request $request)
    {
        $query = Bill::with([
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

        return response()->json($query->orderBy('id', 'desc')->paginate(50));
    }

    public function generateBill(Request $request)
    {
        $validated = $request->validate([
            'sale_ids' => 'required|array|min:1',
            'sale_ids.*' => 'exists:sales,id',
            'customer_name' => 'required|string|max:255',
            'customer_address' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'date_bs' => 'required|string',
            'date_ad' => 'required|date',
            'is_paid_in_full' => 'nullable|boolean',
        ]);

        DB::beginTransaction();
        try {
            // Lock unbilled sales to prevent race conditions
            $sales = Sale::whereIn('id', $validated['sale_ids'])
                ->where('is_billed', false)
                ->lockForUpdate()
                ->get();

            if ($sales->count() !== count($validated['sale_ids'])) {
                DB::rollBack();
                return response()->json(['message' => 'Some sales are already billed or invalid.'], 422);
            }

            $totalAmount = $sales->sum('total_amount');

            // 1. Find or Create Customer
            $customer = Customer::firstOrCreate(
                ['name' => $validated['customer_name']],
                [
                    'address' => $validated['customer_address'] ?? null,
                    'phone' => $validated['customer_phone'] ?? null,
                ]
            );

            // 2. Generate Sales Invoice (Bill)
            $bill = Bill::create([
                'customer_name' => $customer->name,
                'customer_address' => $customer->address,
                'customer_phone' => $customer->phone,
                'date_bs' => $validated['date_bs'],
                'date_ad' => $validated['date_ad'],
                'total_amount' => $totalAmount,
                'is_paid' => false,
                'created_by' => $request->user()->id,
            ]);

            foreach ($sales as $sale) {
                BillItem::create([
                    'bill_id' => $bill->id,
                    'sale_id' => $sale->id,
                    'grain_id' => $sale->grain_id,
                    'quantity' => $sale->quantity,
                    'rate' => $sale->rate,
                    'total_amount' => $sale->total_amount,
                ]);
                $sale->update(['is_billed' => true]);
            }

            // 3. Post DEBIT to Customer Ledger (they now owe us this amount)
            CustomerLedger::create([
                'customer_id' => $customer->id,
                'date_bs' => $validated['date_bs'],
                'date_ad' => $validated['date_ad'],
                'type' => 'DEBIT',
                'amount' => $totalAmount,
                'reference_id' => $bill->bill_number,
                'description' => 'Sales Invoice Generated',
            ]);
            $customer->increment('current_balance', $totalAmount);

            // 4. Optional: Instant Cash Receipt — zero out their balance immediately
            if ($request->is_paid_in_full) {
                $payment = Payment::create([
                    'entity_type' => 'CUSTOMER',
                    'entity_id' => $customer->id,
                    'date_bs' => $validated['date_bs'],
                    'date_ad' => $validated['date_ad'],
                    'amount' => $totalAmount,
                    'payment_method' => 'CASH',
                    'remarks' => 'Cash received on Invoice ' . $bill->bill_number,
                    'created_by' => $request->user()->id,
                ]);

                CustomerLedger::create([
                    'customer_id' => $customer->id,
                    'date_bs' => $validated['date_bs'],
                    'date_ad' => $validated['date_ad'],
                    'type' => 'CREDIT',
                    'amount' => $totalAmount,
                    'reference_id' => 'REC-' . $payment->id,
                    'description' => 'Cash Receipt Settlement',
                ]);
                $customer->decrement('current_balance', $totalAmount);
                $bill->update(['is_paid' => true]);
            }

            DB::commit();
            return response()->json($bill->load('items.grain'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Bill generation failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Bill $bill)
    {
        return response()->json($bill->load('items.grain', 'items.sale', 'user'));
    }

    public function exportPdf(Bill $bill)
    {
        $bill->load('items.grain', 'user');
        $customer = Customer::where('name', $bill->customer_name)->first();

        $data = [
            'bill' => $bill,
            'items' => $bill->items,
            'company' => $bill->user->shop_name ?? 'GallaPasal',
            'user' => $bill->user,
            'customer' => $customer,
        ];

        $pdf = Pdf::loadView('pdf.bill', $data);
        return $pdf->download('Invoice-' . $bill->bill_number . '.pdf');
    }
}

