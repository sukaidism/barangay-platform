<?php

namespace App\Modules\DocumentRequest\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\DocumentRequest\Models\DocumentRequest;
use App\Modules\DocumentRequest\Requests\StoreDocumentRequestRequest;
use App\Modules\DocumentRequest\Requests\UpdateDocumentRequestRequest;
use App\Modules\Resident\Models\Resident;

class DocumentRequestController extends Controller
{
    public function index(): Response
    {
        $documentRequests = DocumentRequest::with('resident')
            ->latest()
            ->paginate(15);

        return Inertia::render('DocumentRequest/Index', [
            'documentRequests' => $documentRequests,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('DocumentRequest/Create', [
            'residents' => Resident::all(['id', 'first_name', 'last_name']),
            'documentTypes' => ['Barangay Clearance', 'Certificate of Residency', 'Business Clearance', 'Certificate of Indigency'],
        ]);
    }

    public function store(StoreDocumentRequestRequest $request): RedirectResponse
    {
        DocumentRequest::create($request->validated());

        return redirect()->route('documentrequest.index')
            ->with('success', 'Document request created successfully.');
    }

    public function show(DocumentRequest $documentrequest): Response
    {
        $documentrequest->load(['resident', 'payments']);

        return Inertia::render('DocumentRequest/Show', [
            'documentRequest' => $documentrequest,
        ]);
    }

    public function edit(DocumentRequest $documentrequest): Response
    {
        return Inertia::render('DocumentRequest/Edit', [
            'documentRequest' => $documentrequest,
            'residents' => Resident::all(['id', 'first_name', 'last_name']),
            'documentTypes' => ['Barangay Clearance', 'Certificate of Residency', 'Business Clearance', 'Certificate of Indigency'],
        ]);
    }

    public function update(UpdateDocumentRequestRequest $request, DocumentRequest $documentrequest): RedirectResponse
    {
        $documentrequest->update($request->validated());

        return redirect()->route('documentrequest.index')
            ->with('success', 'Document request updated successfully.');
    }

    public function destroy(DocumentRequest $documentrequest): RedirectResponse
    {
        $documentrequest->delete();

        return redirect()->route('documentrequest.index')
            ->with('success', 'Document request deleted successfully.');
    }
}
