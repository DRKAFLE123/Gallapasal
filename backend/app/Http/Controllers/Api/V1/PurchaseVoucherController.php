<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PurchaseVoucher;
use App\Models\PurchaseVoucherItem;
use App\Models\Purchase;
use App\Models\Vendor;
use App\Models\VendorLedger;
use App\Models\Payment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseVoucherController extends Controller
{
    public function index(Request $request)
    {
        $query = PurchaseVoucher::with([
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
        if ($request->filled('vendor_name')) {
            $query->where('vendor_name', 'like', '%' . $request->vendor_name . '%');
        }
        if ($request->filled('vendor_type')) {
            $query->where('vendor_type', $request->vendor_type);
        }
        if ($request->filled('is_paid')) {
            $query->where('is_paid', (bool) $request->is_paid);
        }

        $perPage = $request->get('per_page', 50);
        return response()->json($query->orderBy('id', 'desc')->paginate($perPage));
    }

    public function summary(Request $request)
    {
        // Returns total purchased per vendor — useful for the summary panel
        $query = PurchaseVoucher::selectRaw('vendor_name, vendor_type, SUM(total_amount) as total_purchased, COUNT(*) as slip_count')
            ->groupBy('vendor_name', 'vendor_type')
            ->orderByDesc('total_purchased');

        if ($request->has('from_date')) {
            $query->where('date_ad', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('date_ad', '<=', $request->to_date);
        }

        return response()->json($query->get());
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'purchase_ids' => 'required|array|min:1',
            'purchase_ids.*' => 'exists:purchases,id',
            'vendor_name' => 'required|string',
            'vendor_address' => 'nullable|string',
            'vendor_type' => 'nullable|in:farmer,trader,vat_vendor,unregistered_vendor',
            'date_bs' => 'required|string',
            'date_ad' => 'required|date',
            'is_paid_in_full' => 'nullable|boolean'
        ]);

        DB::beginTransaction();
        try {
            // Lock the purchases to prevent race conditions
            $purchases = Purchase::whereIn('id', $validated['purchase_ids'])
                ->lockForUpdate()
                ->get();

            // Optional: you could check if they are already vouchered using a whereDoesntHave query, 
            // but for a simple workflow we just allow generating it based on selection.

            $totalAmount = $purchases->sum('total_amount');
            $voucherNumber = 'PV-' . date('Ymd') . '-' . rand(1000, 9999);

            // 1. Find or Create Vendor Context
            $vendor = Vendor::firstOrCreate(
                ['name' => $validated['vendor_name']],
                [
                    'address' => $validated['vendor_address'] ?? null,
                    'vendor_type' => $validated['vendor_type'] ?? 'farmer'
                ]
            );

            // 2. Draft the internal Purchase Voucher itself
            $voucher = PurchaseVoucher::create([
                'voucher_number' => $voucherNumber,
                'vendor_name' => $vendor->name,
                'vendor_address' => $vendor->address,
                'vendor_type' => $validated['vendor_type'] ?? 'farmer',
                'date_bs' => $validated['date_bs'],
                'date_ad' => $validated['date_ad'],
                'total_amount' => $totalAmount,
                'is_paid' => false,
                'created_by' => $request->user()->id
            ]);

            foreach ($purchases as $purchase) {
                PurchaseVoucherItem::create([
                    'purchase_voucher_id' => $voucher->id,
                    'purchase_id' => $purchase->id,
                    'grain_id' => $purchase->grain_id,
                    'quantity' => $purchase->quantity,
                    'rate' => $purchase->rate,
                    'total_amount' => $purchase->total_amount
                ]);

                $purchase->update(['is_billed' => true]);
            }

            // 3. Post to Vendor Ledger (We owe the vendor this money now)
            VendorLedger::create([
                'vendor_id' => $vendor->id,
                'date_bs' => $validated['date_bs'],
                'date_ad' => $validated['date_ad'],
                'type' => 'CREDIT',
                'amount' => $totalAmount,
                'reference_id' => $voucher->voucher_number,
                'description' => 'Purchase Voucher Generated'
            ]);

            $vendor->increment('current_balance', $totalAmount);

            // 4. Handle simultaneous 'Paid in Full' Instant Cash Dispatch
            if ($request->is_paid_in_full) {
                $payment = Payment::create([
                    'entity_type' => 'VENDOR',
                    'entity_id' => $vendor->id,
                    'date_bs' => $validated['date_bs'],
                    'date_ad' => $validated['date_ad'],
                    'amount' => $totalAmount,
                    'payment_method' => 'CASH',
                    'remarks' => 'Auto-Paid upon Purchase Voucher ' . $voucher->voucher_number,
                    'created_by' => $request->user()->id
                ]);

                VendorLedger::create([
                    'vendor_id' => $vendor->id,
                    'date_bs' => $validated['date_bs'],
                    'date_ad' => $validated['date_ad'],
                    'type' => 'DEBIT',
                    'amount' => $totalAmount,
                    'reference_id' => 'PAY-' . $payment->id,
                    'description' => 'Cash Purchase Settlement'
                ]);

                $vendor->decrement('current_balance', $totalAmount);

                // Mark purchases as fully paid
                Purchase::whereIn('id', $validated['purchase_ids'])->update([
                    'paid_amount' => DB::raw('total_amount'),
                    'payment_method' => 'cash',
                ]);

                $voucher->update(['is_paid' => true]);
            }

            DB::commit();
            return response()->json($voucher->load('items.grain'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Voucher generation failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(PurchaseVoucher $voucher)
    {
        return response()->json($voucher->load('items.grain', 'items.purchase', 'user'));
    }

    public function exportPdf(PurchaseVoucher $voucher)
    {
        $vendor = Vendor::where('name', $voucher->vendor_name)->first();

        $data = [
            'voucher' => $voucher,
            'items' => $voucher->items,
            'company' => $voucher->user->shop_name ?? 'GallaPasal',
            'user' => $voucher->user,
            'vendor' => $vendor // Pass vendor down so blade can parse vendor_type
        ];

        $pdf = Pdf::loadView('pdf.purchase-voucher', $data);
        return $pdf->download('Purchase-Voucher-' . $voucher->voucher_number . '.pdf');
    }
}
