<?php

namespace App\Modules\Payment\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => ['required', 'exists:residents,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'or_number' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:Pending,Paid,Cancelled'],
            'remarks' => ['nullable', 'string'],
        ];
    }
}
