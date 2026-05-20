<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:100'],
            'email'    => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role'     => ['required', 'in:mahasiswa,kaprodi'],

            // NIM: wajib untuk mahasiswa, hanya angka, max 20 digit, harus unik
            'nim' => [
                'nullable',
                'numeric',          // ← hanya angka
                'digits_between:8,20', // minimal 8 digit, maksimal 20 digit
                'unique:users,nim',
                'required_if:role,mahasiswa',
            ],

            // NIP: wajib untuk kaprodi, harus unik
            'nip' => [
                'nullable',
                'string',
                'max:20',
                'unique:users,nip',
                'required_if:role,kaprodi',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'           => 'Nama lengkap wajib diisi.',
            'email.required'          => 'Email wajib diisi.',
            'email.email'             => 'Format email tidak valid.',
            'email.unique'            => 'Email sudah terdaftar.',
            'password.required'       => 'Password wajib diisi.',
            'password.min'            => 'Password minimal 8 karakter.',
            'password.confirmed'      => 'Konfirmasi password tidak cocok.',
            'role.required'           => 'Role wajib dipilih.',
            'role.in'                 => 'Role hanya boleh mahasiswa atau kaprodi.',
            'nim.required_if'         => 'NIM wajib diisi untuk mahasiswa.',
            'nim.numeric'             => 'NIM hanya boleh berisi angka.',
            'nim.digits_between'      => 'NIM harus terdiri dari 8 hingga 20 digit angka.',
            'nim.unique'              => 'NIM sudah terdaftar.',
            'nip.required_if'         => 'NIP wajib diisi untuk kaprodi.',
            'nip.unique'              => 'NIP sudah terdaftar.',
            'nip.max'                 => 'NIP maksimal 20 karakter.',
        ];
    }
}
