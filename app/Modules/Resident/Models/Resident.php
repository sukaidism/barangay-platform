<?php

namespace App\Modules\Resident\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class Resident extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'birthdate',
        'gender',
        'civil_status',
        'contact_number',
        'address',
        'purok',
        'household_id',
        'photo',
        'is_active',
        'status',
        'verification_notes',
        'verified_by',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
            'is_active' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name} {$this->suffix}");
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePendingVerification($query)
    {
        return $query->where('status', 'pending_verification');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Household\Models\Household::class);
    }

    public function documentRequests(): HasMany
    {
        return $this->hasMany(\App\Modules\DocumentRequest\Models\DocumentRequest::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(\App\Modules\Payment\Models\Payment::class);
    }
}
