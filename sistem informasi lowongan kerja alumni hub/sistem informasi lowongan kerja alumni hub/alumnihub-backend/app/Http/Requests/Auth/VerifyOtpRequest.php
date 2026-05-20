<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'email', 'exists:users,email'],
            'otp_code' => ['required', 'string', 'size:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'Email wajib diisi.',
            'email.exists'      => 'Email tidak ditemukan.',
            'otp_code.required' => 'Kode OTP wajib diisi.',
            'otp_code.size'     => 'Kode OTP harus 6 digit.',
        ];
    }
}
