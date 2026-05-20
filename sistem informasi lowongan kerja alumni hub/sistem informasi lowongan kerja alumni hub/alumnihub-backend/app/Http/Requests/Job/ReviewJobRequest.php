<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;

class ReviewJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:approve,rejected,revision'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status review wajib diisi.',
            'status.in'       => 'Status hanya boleh: approve, rejected, atau revision.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Reason wajib jika reject atau revision
            if (in_array($this->status, ['rejected', 'revision']) && empty($this->reason)) {
                $validator->errors()->add('reason', 'Alasan wajib diisi saat menolak atau meminta revisi.');
            }
        });
    }
}
