<?php

namespace Modules\Household\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Household\Models\Household;
use Modules\Household\Http\Requests\StoreHouseholdRequest;
use Modules\Household\Http\Requests\UpdateHouseholdRequest;
use Modules\Resident\Models\Resident;

class HouseholdController extends Controller
{
    public function index(): Response
    {
        $households = Household::with(['head', 'members'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Household/Index', [
            'households' => $households,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Household/Create', [
            'residents' => Resident::whereNull('household_id')->get(['id', 'first_name', 'last_name']),
        ]);
    }

    public function store(StoreHouseholdRequest $request): RedirectResponse
    {
        Household::create($request->validated());

        return redirect()->route('household.index')
            ->with('success', 'Household created successfully.');
    }

    public function show(Household $household): Response
    {
        $household->load(['head', 'members']);

        return Inertia::render('Household/Show', [
            'household' => $household,
        ]);
    }

    public function edit(Household $household): Response
    {
        return Inertia::render('Household/Edit', [
            'household' => $household,
            'residents' => Resident::where(function ($q) use ($household) {
                $q->whereNull('household_id')->orWhere('household_id', $household->id);
            })->get(['id', 'first_name', 'last_name']),
        ]);
    }

    public function update(UpdateHouseholdRequest $request, Household $household): RedirectResponse
    {
        $household->update($request->validated());

        return redirect()->route('household.index')
            ->with('success', 'Household updated successfully.');
    }

    public function destroy(Household $household): RedirectResponse
    {
        $household->delete();

        return redirect()->route('household.index')
            ->with('success', 'Household deleted successfully.');
    }
}
