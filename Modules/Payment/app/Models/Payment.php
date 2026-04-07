<?php

namespace Modules\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    protected $fillable = [
        'resident_id',
        'payable_type',
        'payable_id',
        'amount',
        'or_number',
        'status',
        'remarks',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(\Modules\Resident\Models\Resident::class);
    }

    public function payable(): MorphTo
    {
        return $this->morphTo();
    }
}
