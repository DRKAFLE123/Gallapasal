<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorLedger extends Model
{
    protected $fillable = [
        'vendor_id',
        'date_bs',
        'date_ad',
        'type',
        'amount',
        'reference_id',
        'description'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
