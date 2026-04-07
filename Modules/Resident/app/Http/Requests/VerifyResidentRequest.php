<?php

namespace Modules\Resident\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:approve,reject,revise'],
            'verification_notes' => ['required_if:action,reject,revise', 'nullable', 'string', 'max:1000'],
        ];
    }
}
