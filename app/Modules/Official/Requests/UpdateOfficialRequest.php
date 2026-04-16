<?php

namespace App\Modules\Official\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOfficialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => ['required', 'exists:residents,id'],
            'position' => ['required', 'string', 'max:255'],
            'committee' => ['nullable', 'string', 'max:255'],
            'term_start' => ['required', 'date'],
            'term_end' => ['required', 'date', 'after:term_start'],
            'status' => ['required', 'in:Active,Inactive,Resigned'],
        ];
    }
}
