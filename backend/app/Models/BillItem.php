<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillItem extends Model
{
    protected $guarded = [];

    protected $casts = [
        'quantity' => 'decimal:2',
        'rate' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function grain()
    {
        return $this->belongsTo(Grain::class);
    }
}
