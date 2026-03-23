<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $fillable = [
        'bill_number',
        'customer_name',
        'customer_address',
        'customer_phone',
        'date_bs',
        'date_ad',
        'total_amount',
        'is_paid',
        'created_by'
    ];

    protected $casts = [
        'date_ad' => 'date',
        'total_amount' => 'decimal:2',
        'is_paid' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(BillItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    protected static function boot()
    {
        parent::boot();
        // Auto-generate Bill Number before creation
        static::creating(function ($bill) {
            if (empty($bill->bill_number)) {
                $lastBill = static::orderBy('id', 'desc')->first();
                $lastNumber = $lastBill ? intval(substr($lastBill->bill_number, 4)) : 0;
                $bill->bill_number = 'BILL' . str_pad($lastNumber + 1, 6, '0', STR_PAD_LEFT);
            }
        });
    }
}
