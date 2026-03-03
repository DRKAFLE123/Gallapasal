<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'entity_type',
        'entity_id',
        'date_bs',
        'date_ad',
        'amount',
        'payment_method',
        'remarks',
        'created_by'
    ];

    protected $casts = [
        'date_ad' => 'date',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
