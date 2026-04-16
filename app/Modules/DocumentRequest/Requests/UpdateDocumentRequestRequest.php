<?php

namespace App\Modules\DocumentRequest\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => ['required', 'exists:residents,id'],
            'document_type' => ['required', 'string', 'max:255'],
            'purpose' => ['required', 'string'],
            'status' => ['required', 'in:Pending,Under Review,Approved,Released,Rejected'],
            'remarks' => ['nullable', 'string'],
            'or_number' => ['nullable', 'string', 'max:100'],
            'fee' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
