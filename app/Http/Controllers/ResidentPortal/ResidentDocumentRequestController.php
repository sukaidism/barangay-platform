<?php

namespace App\Http\Controllers\ResidentPortal;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\DocumentRequest\Models\DocumentRequest;

class ResidentDocumentRequestController extends Controller
{
    public function index(): Response
    {
        $resident = auth()->user()->resident;

        $requests = $resident
            ? $resident->documentRequests()->latest()->paginate(15)
            : DocumentRequest::where('id', 0)->paginate(15); // empty

        return Inertia::render('ResidentPortal/DocumentRequest/Index', [
            'documentRequests' => $requests,
            'profileActive' => $resident && $resident->status === 'active',
        ]);
    }

    public function create(): Response|RedirectResponse
    {
        $resident = auth()->user()->resident;

        if (!$resident || $resident->status !== 'active') {
            return redirect()->route('resident-portal.document-requests.index')
                ->with('error', 'Your profile must be verified before requesting documents.');
        }

        return Inertia::render('ResidentPortal/DocumentRequest/Create', [
            'documentTypes' => ['Barangay Clearance', 'Certificate of Residency', 'Business Clearance', 'Certificate of Indigency'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $resident = $request->user()->resident;

        if (!$resident || $resident->status !== 'active') {
            return redirect()->route('resident-portal.document-requests.index')
                ->with('error', 'Your profile must be verified first.');
        }

        $validated = $request->validate([
            'document_type' => ['required', 'string', 'in:Barangay Clearance,Certificate of Residency,Business Clearance,Certificate of Indigency'],
            'purpose' => ['required', 'string', 'max:1000'],
        ]);

        DocumentRequest::create([
            'resident_id' => $resident->id,
            'document_type' => $validated['document_type'],
            'purpose' => $validated['purpose'],
            'status' => 'Pending',
        ]);

        return redirect()->route('resident-portal.document-requests.index')
            ->with('success', 'Document request submitted successfully.');
    }

    public function show(DocumentRequest $documentRequest): Response|RedirectResponse
    {
        $resident = auth()->user()->resident;

        if (!$resident || $documentRequest->resident_id !== $resident->id) {
            abort(403);
        }

        $documentRequest->load('payments');

        return Inertia::render('ResidentPortal/DocumentRequest/Show', [
            'documentRequest' => $documentRequest,
        ]);
    }

    /**
     * Cancel a pending request.
     */
    public function cancel(DocumentRequest $documentRequest): RedirectResponse
    {
        $resident = auth()->user()->resident;

        if (!$resident || $documentRequest->resident_id !== $resident->id) {
            abort(403);
        }

        if ($documentRequest->status !== 'Pending') {
            return redirect()->route('resident-portal.document-requests.index')
                ->with('error', 'Only pending requests can be cancelled.');
        }

        $documentRequest->delete();

        return redirect()->route('resident-portal.document-requests.index')
            ->with('success', 'Request cancelled.');
    }
}
