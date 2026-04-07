<?php

namespace Modules\Resident\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
        ];
    }
}
