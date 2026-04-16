<?php

namespace App\Modules\Payment\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Payment\Models\Payment;
use App\Modules\Payment\Requests\StorePaymentRequest;
use App\Modules\Payment\Requests\UpdatePaymentRequest;
use App\Modules\Resident\Models\Resident;

class PaymentController extends Controller
{
    public function index(): Response
    {
        $payments = Payment::with('resident')
            ->latest()
            ->paginate(15);

        return Inertia::render('Payment/Index', [
            'payments' => $payments,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Payment/Create', [
            'residents' => Resident::all(['id', 'first_name', 'last_name']),
        ]);
    }

    public function store(StorePaymentRequest $request): RedirectResponse
    {
        Payment::create($request->validated());

        return redirect()->route('payment.index')
            ->with('success', 'Payment recorded successfully.');
    }

    public function show(Payment $payment): Response
    {
        $payment->load('resident');

        return Inertia::render('Payment/Show', [
            'payment' => $payment,
        ]);
    }

    public function edit(Payment $payment): Response
    {
        return Inertia::render('Payment/Edit', [
            'payment' => $payment,
            'residents' => Resident::all(['id', 'first_name', 'last_name']),
        ]);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): RedirectResponse
    {
        $payment->update($request->validated());

        return redirect()->route('payment.index')
            ->with('success', 'Payment updated successfully.');
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        return redirect()->route('payment.index')
            ->with('success', 'Payment deleted successfully.');
    }
}
