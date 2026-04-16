<?php

namespace App\Modules\ResidentPortal\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Household\Models\Household;
use App\Modules\Resident\Services\ResidentService;

class ProfileController extends Controller
{
    public function __construct(
        private ResidentService $residentService,
    ) {}

    /**
     * Show the resident's own profile or a registration form if none exists.
     */
    public function show(): Response
    {
        $user = auth()->user();
        $resident = $user->resident;

        if (!$resident) {
            return Inertia::render('ResidentPortal/Profile/Register', [
                'households' => Household::all(['id', 'household_number', 'address']),
            ]);
        }

        $resident->load('household');

        return Inertia::render('ResidentPortal/Profile/Show', [
            'resident' => $resident,
        ]);
    }

    /**
     * Self-register: create a new resident record linked to the current user.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->resident) {
            return redirect()->route('resident-portal.profile')
                ->with('error', 'You already have a resident profile.');
        }

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:20'],
            'birthdate' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'in:Male,Female'],
            'civil_status' => ['required', 'in:Single,Married,Widowed,Separated,Divorced'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'address' => ['required', 'string'],
            'purok' => ['nullable', 'string', 'max:100'],
            'household_id' => ['nullable', 'exists:households,id'],
        ]);

        $this->residentService->createBySelfRegister($validated, $user);

        return redirect()->route('resident-portal.profile')
            ->with('success', 'Your profile has been submitted for verification.');
    }

    /**
     * Submit draft profile for verification.
     */
    public function submit(): RedirectResponse
    {
        $resident = auth()->user()->resident;

        if (!$resident || $resident->status !== 'draft') {
            return redirect()->route('resident-portal.profile')
                ->with('error', 'Profile cannot be submitted.');
        }

        $this->residentService->submitForVerification($resident);

        return redirect()->route('resident-portal.profile')
            ->with('success', 'Your profile has been submitted for verification.');
    }
}
