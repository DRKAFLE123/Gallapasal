<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
        'name',
        'address',
        'phone',
        'vendor_type',
        'opening_balance',
        'current_balance'
    ];

    public function ledgers()
    {
        return $this->hasMany(VendorLedger::class);
    }
}
