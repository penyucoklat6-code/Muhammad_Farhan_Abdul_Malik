<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'         => ['sometimes', 'string', 'max:150'],
            'description'   => ['sometimes', 'string'],
            'requirements'  => ['nullable', 'string'],
            'company'       => ['sometimes', 'string', 'max:150'],
            'location'      => ['sometimes', 'string', 'max:150'],
            'type'          => ['sometimes', 'string', 'max:50'],
            'work_arrangement' => ['sometimes', 'in:WFO,WFH,Hybrid'],
            'salary'        => ['nullable', 'string', 'max:100'],
            'salary_min'    => ['nullable', 'numeric', 'min:0'],
            'salary_max'    => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'deadline'      => ['nullable', 'date'],
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
            'salary_max.gte' => 'Gaji maksimum harus lebih besar atau sama dengan gaji minimum.',
        ];
    }
}
