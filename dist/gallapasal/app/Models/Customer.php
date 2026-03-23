<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CustomerLedger;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'address',
        'phone',
        'opening_balance',
        'current_balance'
    ];

    public function ledgers()
    {
        return $this->hasMany(CustomerLedger::class);
    }
}
