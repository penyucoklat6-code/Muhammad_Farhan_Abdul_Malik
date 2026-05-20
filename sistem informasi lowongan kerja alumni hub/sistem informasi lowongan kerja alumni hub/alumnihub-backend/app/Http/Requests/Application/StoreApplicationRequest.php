<?php

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cv_path'        => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'portfolio_path' => ['nullable', 'file', 'mimes:pdf,doc,docx,zip', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'cv_path.required' => 'CV wajib diunggah.',
            'cv_path.file'     => 'CV harus berupa file.',
            'cv_path.mimes'    => 'CV harus berformat PDF, DOC, atau DOCX.',
            'cv_path.max'      => 'Ukuran CV maksimal 5MB.',
            'portfolio_path.mimes' => 'Portfolio harus berformat PDF, DOC, DOCX, atau ZIP.',
            'portfolio_path.max'   => 'Ukuran portfolio maksimal 10MB.',
        ];
    }
}
