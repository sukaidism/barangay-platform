<?php

namespace App\Modules\Resident\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Resident\Models\Resident;
use App\Modules\Resident\Requests\StoreResidentRequest;
use App\Modules\Resident\Requests\UpdateResidentRequest;
use App\Modules\Resident\Requests\VerifyResidentRequest;
use App\Modules\Resident\Services\ResidentService;
use App\Modules\Household\Models\Household;
use App\Models\AuditLog;

class ResidentController extends Controller
{
    public function __construct(
        private ResidentService $residentService,
    ) {}

    public function index(): Response
    {
        $residents = Resident::with('household')
            ->latest()
            ->paginate(15);

        $pendingCount = Resident::pendingVerification()->count();

        return Inertia::render('Resident/Index', [
            'residents' => $residents,
            'pendingCount' => $pendingCount,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Resident/Create', [
            'households' => Household::all(['id', 'household_number', 'address']),
        ]);
    }

    public function store(StoreResidentRequest $request): RedirectResponse
    {
        $this->residentService->createByStaff(
            $request->validated(),
            $request->user(),
        );

        return redirect()->route('resident.index')
            ->with('success', 'Resident record created and queued for verification.');
    }

    public function show(Resident $resident): Response
    {
        $resident->load(['household', 'documentRequests', 'payments', 'verifier']);

        $auditLogs = AuditLog::where('auditable_type', Resident::class)
            ->where('auditable_id', $resident->id)
            ->with('user')
            ->latest()
            ->limit(20)
            ->get();

        return Inertia::render('Resident/Show', [
            'resident' => $resident,
            'auditLogs' => $auditLogs,
        ]);
    }

    public function edit(Resident $resident): Response
    {
        return Inertia::render('Resident/Edit', [
            'resident' => $resident,
            'households' => Household::all(['id', 'household_number', 'address']),
        ]);
    }

    public function update(UpdateResidentRequest $request, Resident $resident): RedirectResponse
    {
        $this->residentService->update(
            $resident,
            $request->validated(),
            $request->user(),
        );

        return redirect()->route('resident.show', $resident)
            ->with('success', 'Resident updated successfully.');
    }

    public function destroy(Resident $resident): RedirectResponse
    {
        $resident->delete();

        return redirect()->route('resident.index')
            ->with('success', 'Resident deleted successfully.');
    }

    /**
     * Show pending verification queue.
     */
    public function verification(): Response
    {
        $residents = Resident::with('household')
            ->whereIn('status', ['pending_verification', 'draft'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Resident/Verification', [
            'residents' => $residents,
        ]);
    }

    /**
     * Process verification (approve/reject/revise).
     */
    public function processVerification(VerifyResidentRequest $request, Resident $resident): RedirectResponse
    {
        $action = $request->validated()['action'];
        $notes = $request->validated()['verification_notes'] ?? null;
        $user = $request->user();

        match ($action) {
            'approve' => $this->residentService->verify($resident, $user, $notes),
            'reject' => $this->residentService->reject($resident, $user, $notes),
            'revise' => $this->residentService->requestRevision($resident, $user, $notes),
        };

        $label = match ($action) {
            'approve' => 'approved',
            'reject' => 'rejected',
            'revise' => 'sent back for revision',
        };

        return redirect()->route('resident.verification')
            ->with('success', "Resident record has been {$label}.");
    }
}
