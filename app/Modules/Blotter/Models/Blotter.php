<?php

namespace App\Modules\Blotter\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blotter extends Model
{
    protected $fillable = [
        'complainant_id',
        'respondent_id',
        'incident_type',
        'narrative',
        'incident_date',
        'incident_location',
        'status',
        'resolution',
    ];

    protected function casts(): array
    {
        return [
            'incident_date' => 'date',
        ];
    }

    public function complainant(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Resident\Models\Resident::class, 'complainant_id');
    }

    public function respondent(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Resident\Models\Resident::class, 'respondent_id');
    }
}
