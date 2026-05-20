<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'status'           => $this->status,
            'cv_path'          => $this->cv_path
                                    ? asset('storage/' . $this->cv_path)
                                    : null,
            'portfolio_path'   => $this->portfolio_path
                                    ? asset('storage/' . $this->portfolio_path)
                                    : null,
            'applied_at'       => $this->applied_at?->toDateTimeString(),
            'updated_at'       => $this->updated_at?->toDateTimeString(),
            'applicant'        => $this->whenLoaded('user', fn() => [
                'id'    => $this->user?->id,
                'name'  => $this->user?->name,
                'email' => $this->user?->email,
            ]),
            'job'              => $this->whenLoaded('job', fn() => [
                'id'      => $this->job?->id,
                'title'   => $this->job?->title,
                'company' => $this->job?->company,
            ]),
        ];
    }
}
