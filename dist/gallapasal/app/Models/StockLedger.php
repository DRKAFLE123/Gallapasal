<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockLedger extends Model
{
    protected $guarded = [];

    public function grain()
    {
        return $this->belongsTo(Grain::class);
    }
}
