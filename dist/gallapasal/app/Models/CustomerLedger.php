<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;

class CustomerLedger extends Model
{
    protected $fillable = [
        'customer_id',
        'date_bs',
        'date_ad',
        'type',
        'amount',
        'reference_id',
        'description'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
