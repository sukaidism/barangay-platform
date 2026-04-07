<?php

namespace Modules\Household\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHouseholdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'head_id' => ['nullable', 'exists:residents,id'],
            'household_number' => ['required', 'string', 'max:50', 'unique:households'],
            'address' => ['required', 'string'],
            'purok' => ['nullable', 'string', 'max:100'],
        ];
    }
}
