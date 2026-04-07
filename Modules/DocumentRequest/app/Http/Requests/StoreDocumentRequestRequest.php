<?php

namespace Modules\DocumentRequest\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequestRequest extends FormRequest
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
            'fee' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
