<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Internal Purchase Voucher</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .company-logo {
            max-width: 120px;
            max-height: 80px;
            margin-bottom: 10px;
        }

        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1e3a8a;
            margin: 0;
            text-transform: uppercase;
        }

        .company-details {
            font-size: 14px;
            color: #6b7280;
            margin: 5px 0 0 0;
        }

        .document-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 25px;
            text-transform: uppercase;
            text-decoration: underline;
        }

        .meta-container {
            width: 100%;
            margin-bottom: 30px;
        }

        .meta-col {
            width: 48%;
            display: inline-block;
            vertical-align: top;
        }

        .meta-label {
            font-weight: bold;
            display: inline-block;
            width: 100px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th,
        td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
        }

        th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: bold;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .total-row {
            font-weight: bold;
            background-color: #e5e7eb;
        }

        .signatures {
            margin-top: 80px;
            width: 100%;
        }

        .signature-box {
            width: 40%;
            display: inline-block;
            text-align: center;
            margin-top: 50px;
        }

        .signature-line {
            border-top: 1px solid #000;
            width: 80%;
            margin: 0 auto;
            padding-top: 5px;
        }

        .legal-note {
            margin-top: 40px;
            font-size: 11px;
            color: #6b7280;
            text-align: justify;
            border-top: 1px dashed #d1d5db;
            padding-top: 10px;
        }

        .slip-container {
            border: 1px dashed #9ca3af;
            padding: 20px;
            margin-bottom: 20px;
            box-sizing: border-box;
            background: #fff;
        }

        .slip-signature-spacer {
            height: 40px;
            /* Spacer to push signatures down if items are few */
        }
    </style>
</head>

<body>

    @php
        $copies = [
            ['title' => 'Original Copy', 'subtitle' => 'For Farmer / Vendor'],
            ['title' => 'Office Copy', 'subtitle' => 'For Internal Record']
        ];
    @endphp

    @foreach($copies as $index => $copy)
        <div class="slip-container" style="page-break-after: {{ $index === 0 ? 'always' : 'auto' }};">
            <div class="header">
                @if($user->logo_path)
                    @php
                        $imagePath = storage_path('app/public/' . $user->logo_path);
                        if (file_exists($imagePath)) {
                            $type = pathinfo($imagePath, PATHINFO_EXTENSION);
                            $data = file_get_contents($imagePath);
                            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                            echo '<img src="' . $base64 . '" class="company-logo" />';
                        }
                    @endphp
                @endif
                <h1 class="company-name">{{ $company }}</h1>
                <p class="company-details">
                    @if($user->pan_number) PAN/VAT: <strong>{{ $user->pan_number }}</strong> @endif
                    @if($user->registration_number) | Reg No: <strong>{{ $user->registration_number }}</strong> @endif
                </p>
            </div>

            <div class="document-title">
                Internal Purchase Memo / Receipt <br />
                <span style="font-size: 14px; color: #4b5563; font-weight: normal;">({{ $copy['title'] }} -
                    {{ $copy['subtitle'] }})</span>
            </div>

            <div class="meta-container">
                <div class="meta-col">
                    <div style="margin-bottom: 8px;">
                        <span class="meta-label">Vendor:</span> {{ $voucher->vendor_name }}
                        @if(isset($vendor) && $vendor->vendor_type)
                            <strong
                                style="margin-left: 5px; color: #2563eb; font-size: 12px; background: #eff6ff; padding: 2px 6px; border-radius: 4px; border: 1px solid #bfdbfe;">
                                {{ str_replace('_', ' ', strtoupper($vendor->vendor_type)) }}
                            </strong>
                        @endif
                    </div>
                    <div><span class="meta-label">Address:</span> {{ $voucher->vendor_address ?? 'N/A' }}</div>
                </div>
                <div class="meta-col">
                    <div style="margin-bottom: 8px;"><span class="meta-label">Voucher No:</span>
                        {{ $voucher->voucher_number }}</div>
                    <div style="margin-bottom: 8px;"><span class="meta-label">Date (BS):</span> {{ $voucher->date_bs }}
                    </div>
                    <div><span class="meta-label">Date (AD):</span>
                        {{ \Carbon\Carbon::parse($voucher->date_ad)->format('Y-m-d') }}</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th width="5%">S.N.</th>
                        <th width="35%">Grain / Item Description</th>
                        <th width="15%" class="text-right">Quantity</th>
                        <th width="20%" class="text-right">Rate (Rs)</th>
                        <th width="25%" class="text-right">Total (Rs)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $item)
                        <tr>
                            <td class="text-center">{{ $loop->index + 1 }}</td>
                            <td>{{ $item->grain->name }} ({{ $item->grain->unit_type }})</td>
                            <td class="text-right">{{ number_format($item->quantity, 2) }}</td>
                            <td class="text-right">{{ number_format($item->rate, 2) }}</td>
                            <td class="text-right">{{ number_format($item->total_amount, 2) }}</td>
                        </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="4" class="text-right">Grand Total:</td>
                        <td class="text-right">Rs. {{ number_format($voucher->total_amount, 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="legal-note">
                <strong>Note for Accounting:</strong> This Internal Purchase Memo serves as official evidence for the direct
                purchase of agricultural goods from the aforementioned farmer/vendor. As per the prevailing laws, purchases
                of basic agricultural commodities from individual farmers may be exempt from standard VAT PAN invoicing
                requirements, substituting this internal receipt signed by both parties as valid ledger evidence.
            </div>

            <div class="signatures">
                <div class="signature-box" style="float: left;">
                    <div class="signature-line">
                        <strong>Received By (Vendor)</strong><br>
                        <span>Signature or Thumbprint</span>
                    </div>
                </div>

                <div class="signature-box" style="float: right;">
                    <div class="signature-line">
                        <strong>Prepared & Authorized By</strong><br>
                        <span>{{ $user->name }} ({{ $company }})</span>
                    </div>
                </div>
                <div style="clear: both;"></div>
            </div>
        </div>
    @endforeach

</body>

</html>