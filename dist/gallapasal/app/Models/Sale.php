<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'date_bs',
        'date_ad',
        'time',
        'customer_name',
        'grain_id',
        'quantity',
        'rate',
        'total_amount',
        'remarks',
        'created_by',
        'is_billed'
    ];

    protected $casts = ['is_billed' => 'boolean'];

    public function grain()
    {
        return $this->belongsTo(Grain::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
