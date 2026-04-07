<?php

namespace App\Http\Controllers\ResidentPortal;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Blotter\Models\Blotter;
use Modules\Resident\Models\Resident;

class ResidentBlotterController extends Controller
{
    public function index(): Response
    {
        $resident = auth()->user()->resident;

        $blotters = $resident
            ? Blotter::with(['complainant', 'respondent'])
                ->where(function ($q) use ($resident) {
                    $q->where('complainant_id', $resident->id)
                      ->orWhere('respondent_id', $resident->id);
                })
                ->latest()
                ->paginate(15)
            : Blotter::where('id', 0)->paginate(15);

        return Inertia::render('ResidentPortal/Blotter/Index', [
            'blotters' => $blotters,
            'profileActive' => $resident && $resident->status === 'active',
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $resident = auth()->user()->resident;

        if (!$resident || $resident->status !== 'active') {
            return redirect()->route('resident-portal.blotters.index')
                ->with('error', 'Your profile must be verified before filing a blotter.');
        }

        // Respondent dropdown — all active residents except self
        $residents = Resident::active()
            ->where('id', '!=', $resident->id)
            ->get(['id', 'first_name', 'last_name']);

        return Inertia::render('ResidentPortal/Blotter/Create', [
            'residents' => $residents,
            'complainantName' => $resident->full_name,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $resident = $request->user()->resident;

        if (!$resident || $resident->status !== 'active') {
            return redirect()->route('resident-portal.blotters.index')
                ->with('error', 'Your profile must be verified first.');
        }

        $validated = $request->validate([
            'respondent_id' => ['required', 'exists:residents,id'],
            'incident_type' => ['required', 'string', 'max:255'],
            'narrative' => ['required', 'string'],
            'incident_date' => ['required', 'date'],
            'incident_location' => ['nullable', 'string', 'max:255'],
        ]);

        Blotter::create([
            'complainant_id' => $resident->id,
            'respondent_id' => $validated['respondent_id'],
            'incident_type' => $validated['incident_type'],
            'narrative' => $validated['narrative'],
            'incident_date' => $validated['incident_date'],
            'incident_location' => $validated['incident_location'] ?? null,
            'status' => 'Filed',
        ]);

        return redirect()->route('resident-portal.blotters.index')
            ->with('success', 'Blotter report filed successfully.');
    }

    public function show(Blotter $blotter): Response
    {
        $resident = auth()->user()->resident;

        if (!$resident || ($blotter->complainant_id !== $resident->id && $blotter->respondent_id !== $resident->id)) {
            abort(403);
        }

        $blotter->load(['complainant', 'respondent']);

        return Inertia::render('ResidentPortal/Blotter/Show', [
            'blotter' => $blotter,
        ]);
    }
}
