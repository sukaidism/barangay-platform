<?php

namespace App\Modules\Official\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Official extends Model
{
    protected $fillable = [
        'resident_id',
        'position',
        'committee',
        'term_start',
        'term_end',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'term_start' => 'date',
            'term_end' => 'date',
        ];
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Resident\Models\Resident::class);
    }
}
