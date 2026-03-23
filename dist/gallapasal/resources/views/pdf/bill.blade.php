<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Bill #{{ $bill->bill_number }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
        }

        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin: 0;
        }

        .bill-details {
            width: 100%;
            margin-bottom: 30px;
        }

        .bill-details td {
            vertical-align: top;
        }

        .text-right {
            text-align: right;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        .table th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: bold;
        }

        .table .text-right {
            text-align: right;
        }

        .totals-table {
            width: 50%;
            float: right;
            border-collapse: collapse;
        }

        .totals-table th,
        .totals-table td {
            padding: 8px;
            border: 1px solid #ddd;
        }

        .totals-table th {
            background-color: #f8fafc;
            text-align: left;
        }

        .footer {
            clear: both;
            margin-top: 50px;
            text-align: center;
            color: #64748b;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <div class="header">
        @if(isset($user) && $user->logo_path)
            <img src="{{ storage_path('app/public/' . $user->logo_path) }}" alt="Logo"
                style="max-height: 80px; margin-bottom: 10px;">
        @endif
        <h1 class="company-name">{{ $company }}</h1>
        @if(isset($user) && ($user->pan_number || $user->registration_number))
            <p style="margin: 5px 0;">
                @if($user->pan_number) <strong>PAN/VAT:</strong> {{ $user->pan_number }} @endif
                @if($user->pan_number && $user->registration_number) | @endif
                @if($user->registration_number) <strong>Reg No:</strong> {{ $user->registration_number }} @endif
            </p>
        @endif
        @if(isset($user) && $user->shop_address)
            <p style="margin: 3px 0; color: #555; font-size: 13px;">📍 {{ $user->shop_address }}</p>
        @endif
        <p style="font-size: 18px; font-weight: bold; letter-spacing: 1px;">SALES INVOICE / TAX INVOICE</p>
    </div>

    <table class="bill-details">
        <tr>
            <td>
                <strong>Billed To:</strong><br>
                {{ $bill->customer_name ?? 'Customer' }}<br>
                @if($bill->customer_address)<small>{{ $bill->customer_address }}</small><br>@endif
                @if($bill->customer_phone)<small>📞 {{ $bill->customer_phone }}</small><br>@endif
                @if(isset($customer) && $customer->current_balance > 0)
                    <span style="color: #dc2626; font-size: 12px;">Outstanding: Rs.
                        {{ number_format($customer->current_balance, 2) }}</span>
                @endif
            </td>
            <td class="text-right">
                <strong>Invoice Number:</strong><br>
                <span style="font-size: 18px; color: #dc2626;">{{ $bill->bill_number }}</span><br>
                <strong>Date (BS):</strong> {{ $bill->date_bs }}<br>
                <strong>Date (AD):</strong> {{ \Carbon\Carbon::parse($bill->date_ad)->format('Y-m-d') }}<br>
                <strong>Status:</strong>
                @if($bill->is_paid)
                    <span style="color: #16a34a; font-weight: bold;">✓ PAID</span>
                @else
                    <span style="color: #dc2626; font-weight: bold;">⚠ UNPAID</span>
                @endif
            </td>
        </tr>
    </table>

    <table class="table">
        <thead>
            <tr>
                <th>S.N.</th>
                <th>Grain Type</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Rate (Rs)</th>
                <th class="text-right">Total (Rs)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->grain->name ?? 'N/A' }}</td>
                    <td class="text-right">{{ number_format($item->quantity, 2) }}</td>
                    <td class="text-right">{{ number_format($item->rate, 2) }}</td>
                    <td class="text-right">{{ number_format($item->total_amount, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals-table">
        <tr>
            <th>Sub Total:</th>
            <td class="text-right">Rs. {{ number_format($bill->total_amount, 2) }}</td>
        </tr>
        <tr>
            <th>Discount:</th>
            <td class="text-right">Rs. 0.00</td>
        </tr>
        <tr>
            <th>Grand Total:</th>
            <td class="text-right" style="font-weight: bold; font-size: 16px;">Rs.
                {{ number_format($bill->total_amount, 2) }}
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>Thank you for doing business with us!</p>
        <p>Generated by {{ $company }} - Grain Accounting System</p>
    </div>
</body>

</html>