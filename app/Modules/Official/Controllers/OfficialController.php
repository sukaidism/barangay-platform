<?php

namespace App\Modules\Official\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Official\Models\Official;
use App\Modules\Official\Requests\StoreOfficialRequest;
use App\Modules\Official\Requests\UpdateOfficialRequest;
use App\Modules\Resident\Models\Resident;

class OfficialController extends Controller
{
    public function index(): Response
    {
        $officials = Official::with('resident')
            ->latest()
            ->paginate(15);

        return Inertia::render('Official/Index', [
            'officials' => $officials,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Official/Create', [
            'residents' => Resident::all(['id', 'first_name', 'last_name']),
        ]);
    }

    public function store(StoreOfficialRequest $request): RedirectResponse
    {
        Official::create($request->validated());

        return redirect()->route('official.index')
            ->with('success', 'Official created successfully.');
    }

    public function show(Official $official): Response
    {
        $official->load('resident');

        return Inertia::render('Official/Show', [
            'official' => $official,
        ]);
    }

    public function edit(Official $official): Response
    {
        return Inertia::render('Official/Edit', [
            'official' => $official,
            'residents' => Resident::all(['id', 'first_name', 'last_name']),
        ]);
    }

    public function update(UpdateOfficialRequest $request, Official $official): RedirectResponse
    {
        $official->update($request->validated());

        return redirect()->route('official.index')
            ->with('success', 'Official updated successfully.');
    }

    public function destroy(Official $official): RedirectResponse
    {
        $official->delete();

        return redirect()->route('official.index')
            ->with('success', 'Official deleted successfully.');
    }
}
