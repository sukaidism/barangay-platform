<?php

namespace App\Modules\Blotter\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Blotter\Models\Blotter;
use App\Modules\Blotter\Requests\StoreBlotterRequest;
use App\Modules\Blotter\Requests\UpdateBlotterRequest;
use App\Modules\Resident\Models\Resident;

class BlotterController extends Controller
{
    public function index(): Response
    {
        $blotters = Blotter::with(['complainant', 'respondent'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Blotter/Index', [
            'blotters' => $blotters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Blotter/Create', [
            'residents' => Resident::all(['id', 'first_name', 'last_name']),
        ]);
    }

    public function store(StoreBlotterRequest $request): RedirectResponse
    {
        Blotter::create($request->validated());

        return redirect()->route('blotter.index')
            ->with('success', 'Blotter record created successfully.');
    }

    public function show(Blotter $blotter): Response
    {
        $blotter->load(['complainant', 'respondent']);

        return Inertia::render('Blotter/Show', [
            'blotter' => $blotter,
        ]);
    }

    public function edit(Blotter $blotter): Response
    {
        return Inertia::render('Blotter/Edit', [
            'blotter' => $blotter,
            'residents' => Resident::all(['id', 'first_name', 'last_name']),
        ]);
    }

    public function update(UpdateBlotterRequest $request, Blotter $blotter): RedirectResponse
    {
        $blotter->update($request->validated());

        return redirect()->route('blotter.index')
            ->with('success', 'Blotter record updated successfully.');
    }

    public function destroy(Blotter $blotter): RedirectResponse
    {
        $blotter->delete();

        return redirect()->route('blotter.index')
            ->with('success', 'Blotter record deleted successfully.');
    }
}
