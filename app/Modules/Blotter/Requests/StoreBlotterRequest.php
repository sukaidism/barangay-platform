<?php

namespace App\Modules\Blotter\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlotterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'complainant_id' => ['required', 'exists:residents,id'],
            'respondent_id' => ['nullable', 'exists:residents,id', 'different:complainant_id'],
            'incident_type' => ['required', 'string', 'max:255'],
            'narrative' => ['required', 'string'],
            'incident_date' => ['required', 'date'],
            'incident_location' => ['nullable', 'string', 'max:255'],
        ];
    }
}
