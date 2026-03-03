<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'date_bs',
        'date_ad',
        'time',
        'vendor_name',
        'vendor_address',
        'vendor_type',
        'grain_id',
        'quantity',
        'rate',
        'total_amount',
        'paid_amount',
        'payment_method',
        'remarks',
        'is_billed',
        'created_by'
    ];

    protected $casts = [
        'is_billed' => 'boolean',
        'paid_amount' => 'float',
        'total_amount' => 'float',
    ];

    public function getPaymentStatusAttribute(): string
    {
        if ($this->paid_amount <= 0)
            return 'unpaid';
        if ($this->paid_amount >= $this->total_amount)
            return 'fully_paid';
        return 'partially_paid';
    }

    public function grain()
    {
        return $this->belongsTo(Grain::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
