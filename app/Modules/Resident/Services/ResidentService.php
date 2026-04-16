<?php

namespace App\Modules\Resident\Services;

use App\Models\AuditLog;
use App\Models\User;
use App\Modules\Resident\Models\Resident;

class ResidentService
{
    /**
     * Staff creates a resident (walk-in intake). Starts as draft or pending_verification.
     */
    public function createByStaff(array $data, User $staffUser): Resident
    {
        $data['status'] = 'pending_verification';
        $resident = Resident::create($data);

        AuditLog::log('created', $resident, null, $data, "Walk-in intake by {$staffUser->name}");

        return $resident;
    }

    /**
     * Resident self-registers. Starts as draft.
     */
    public function createBySelfRegister(array $data, User $residentUser): Resident
    {
        $data['user_id'] = $residentUser->id;
        $data['status'] = 'draft';

        $resident = Resident::create($data);

        AuditLog::log('created', $resident, null, $data, 'Online self-registration');

        return $resident;
    }

    /**
     * Submit a draft for verification.
     */
    public function submitForVerification(Resident $resident): Resident
    {
        $old = ['status' => $resident->status];
        $resident->update(['status' => 'pending_verification']);

        AuditLog::log('status_changed', $resident, $old, ['status' => 'pending_verification'], 'Submitted for verification');

        return $resident;
    }

    /**
     * Staff verifies and approves a resident profile.
     */
    public function verify(Resident $resident, User $staffUser, ?string $notes = null): Resident
    {
        $old = ['status' => $resident->status];

        $resident->update([
            'status' => 'active',
            'is_active' => true,
            'verified_by' => $staffUser->id,
            'verified_at' => now(),
            'verification_notes' => $notes,
        ]);

        AuditLog::log('verified', $resident, $old, ['status' => 'active'], "Approved by {$staffUser->name}. {$notes}");

        return $resident;
    }

    /**
     * Staff rejects a resident profile with a reason.
     */
    public function reject(Resident $resident, User $staffUser, string $reason): Resident
    {
        $old = ['status' => $resident->status];

        $resident->update([
            'status' => 'rejected',
            'verified_by' => $staffUser->id,
            'verified_at' => now(),
            'verification_notes' => $reason,
        ]);

        AuditLog::log('rejected', $resident, $old, ['status' => 'rejected'], "Rejected by {$staffUser->name}: {$reason}");

        return $resident;
    }

    /**
     * Send back to draft for revisions (from rejected or pending).
     */
    public function requestRevision(Resident $resident, User $staffUser, string $notes): Resident
    {
        $old = ['status' => $resident->status];

        $resident->update([
            'status' => 'draft',
            'verification_notes' => $notes,
        ]);

        AuditLog::log('revision_requested', $resident, $old, ['status' => 'draft'], "Revision requested by {$staffUser->name}: {$notes}");

        return $resident;
    }

    /**
     * Update a resident's profile and log changes.
     */
    public function update(Resident $resident, array $data, User $updatedBy): Resident
    {
        $old = $resident->only(array_keys($data));
        $resident->update($data);

        AuditLog::log('updated', $resident, $old, $data, "Updated by {$updatedBy->name}");

        return $resident;
    }
}
