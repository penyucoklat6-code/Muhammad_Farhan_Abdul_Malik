<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'         => ['required', 'string', 'max:150'],
            'description'   => ['required', 'string'],
            'requirements'  => ['nullable', 'string'],
            'company'       => ['required', 'string', 'max:150'],
            'location'      => ['required', 'string', 'max:150'],
            'type'          => ['required', 'string', 'max:50'],
            'work_arrangement' => ['required', 'in:WFO,WFH,Hybrid'],
            'salary'        => ['nullable', 'string', 'max:100'],
            'salary_min'    => ['nullable', 'numeric', 'min:0'],
            'salary_max'    => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'deadline'      => ['nullable', 'date', 'after:today'],
            'link_apply'    => ['nullable', 'url', 'max:255'],
            'external_link' => ['nullable', 'url', 'max:255'],
            'category_id'   => ['nullable', 'exists:categories,id'],
            'major_id'      => ['nullable', 'exists:majors,id'],
            'poster'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'logo'          => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:1024'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Judul lowongan wajib diisi.',
            'description.required' => 'Deskripsi lowongan wajib diisi.',
            'company.required'     => 'Nama perusahaan wajib diisi.',
            'location.required'    => 'Lokasi kerja wajib diisi.',
            'type.required'        => 'Tipe pekerjaan wajib diisi.',
            'deadline.after'       => 'Tanggal deadline harus setelah hari ini.',
            'link_apply.url'       => 'Link apply harus berupa URL yang valid.',
            'external_link.url'    => 'Link perusahaan harus berupa URL yang valid.',
            'category_id.exists'   => 'Kategori tidak ditemukan.',
            'major_id.exists'      => 'Jurusan tidak ditemukan.',
            'poster.image'         => 'Poster harus berupa gambar.',
            'poster.max'           => 'Ukuran poster maksimal 2MB.',
            'logo.image'           => 'Logo harus berupa gambar.',
            'logo.max'             => 'Ukuran logo maksimal 1MB.',
            'salary_max.gte'       => 'Gaji maksimum harus lebih besar atau sama dengan gaji minimum.',
        ];
    }
}
