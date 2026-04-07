<?php

namespace Modules\Household\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Household extends Model
{
    protected $fillable = [
        'head_id',
        'household_number',
        'address',
        'purok',
    ];

    public function head(): BelongsTo
    {
        return $this->belongsTo(\Modules\Resident\Models\Resident::class, 'head_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(\Modules\Resident\Models\Resident::class);
    }
}
