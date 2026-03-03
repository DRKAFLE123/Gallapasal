<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PurchaseVoucher;
use App\Models\Purchase;
use App\Models\Grain;

class PurchaseVoucherItem extends Model
{
    protected $fillable = [
        'purchase_voucher_id',
        'purchase_id',
        'grain_id',
        'quantity',
        'rate',
        'total_amount'
    ];

    public function voucher()
    {
        return $this->belongsTo(PurchaseVoucher::class);
    }

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function grain()
    {
        return $this->belongsTo(Grain::class);
    }
}
