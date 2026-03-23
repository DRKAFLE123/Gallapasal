<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\GenericExport;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Payment;
use App\Models\Expense;

class ExportController extends Controller
{
    public function exportPurchases(Request $request)
    {
        $query = Purchase::with('grain');
        if ($request->has('from_date'))
            $query->where('date_ad', '>=', $request->from_date);
        if ($request->has('to_date'))
            $query->where('date_ad', '<=', $request->to_date);

        $data = $query->orderBy('date_ad', 'desc')->get()->map(function ($p) {
            return [
                'Date (BS)' => $p->date_bs,
                'Vendor' => $p->vendor_name,
                'Grain' => $p->grain->name,
                'Quantity' => $p->quantity,
                'Rate (Rs)' => $p->rate,
                'Total (Rs)' => $p->total_amount,
                'Billed' => $p->is_billed ? 'Yes' : 'No'
            ];
        })->toArray();

        $headings = ['Date (BS)', 'Vendor', 'Grain', 'Quantity', 'Rate (Rs)', 'Total (Rs)', 'Billed'];
        return Excel::download(new GenericExport($data, $headings), 'purchases.xlsx');
    }

    public function exportSales(Request $request)
    {
        $query = Sale::with('grain');
        if ($request->has('from_date'))
            $query->where('date_ad', '>=', $request->from_date);
        if ($request->has('to_date'))
            $query->where('date_ad', '<=', $request->to_date);

        $data = $query->orderBy('date_ad', 'desc')->get()->map(function ($s) {
            return [
                'Date (BS)' => $s->date_bs,
                'Customer' => $s->customer_name,
                'Grain' => $s->grain->name,
                'Quantity' => $s->quantity,
                'Rate (Rs)' => $s->rate,
                'Total (Rs)' => $s->total_amount,
            ];
        })->toArray();

        $headings = ['Date (BS)', 'Customer', 'Grain', 'Quantity', 'Rate (Rs)', 'Total (Rs)'];
        return Excel::download(new GenericExport($data, $headings), 'sales.xlsx');
    }

    public function exportPayments(Request $request)
    {
        $query = Payment::query();
        if ($request->has('from_date'))
            $query->where('date_ad', '>=', $request->from_date);
        if ($request->has('to_date'))
            $query->where('date_ad', '<=', $request->to_date);

        $data = $query->orderBy('date_ad', 'desc')->get()->map(function ($p) {
            return [
                'Date (BS)' => $p->date_bs,
                'Type' => $p->type,
                'Party Name' => $p->party_name,
                'Amount (Rs)' => $p->amount,
                'Mode' => $p->payment_mode,
                'Reference No' => $p->reference_no,
            ];
        })->toArray();

        $headings = ['Date (BS)', 'Type', 'Party Name', 'Amount (Rs)', 'Mode', 'Reference No'];
        return Excel::download(new GenericExport($data, $headings), 'payments.xlsx');
    }
}
