<?php

namespace App\Modules\DocumentRequest\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class DocumentRequest extends Model
{
    protected $fillable = [
        'resident_id',
        'document_type',
        'purpose',
        'status',
        'remarks',
        'or_number',
        'fee',
        'released_at',
    ];

    protected function casts(): array
    {
        return [
            'fee' => 'decimal:2',
            'released_at' => 'datetime',
        ];
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Resident\Models\Resident::class);
    }

    public function payments(): MorphMany
    {
        return $this->morphMany(\App\Modules\Payment\Models\Payment::class, 'payable');
    }
}
