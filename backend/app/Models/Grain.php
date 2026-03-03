<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grain extends Model
{
    protected $fillable = ['name', 'unit_type', 'is_active'];

    public function stockLedger()
    {
        return $this->hasOne(StockLedger::class);
    }
}
