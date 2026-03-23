<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseVoucher extends Model
{
    protected $fillable = [
        'voucher_number',
        'vendor_name',
        'vendor_address',
        'vendor_type',
        'date_bs',
        'date_ad',
        'total_amount',
        'is_paid',
        'created_by'
    ];

    protected $casts = [
        'is_paid' => 'boolean',
        'total_amount' => 'float',
    ];

    public function getPaymentStatusAttribute(): string
    {
        return $this->is_paid ? 'fully_paid' : 'unpaid';
    }

    public function items()
    {
        return $this->hasMany(PurchaseVoucherItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
