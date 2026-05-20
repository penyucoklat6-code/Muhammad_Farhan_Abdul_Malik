<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'description'  => $this->description,
            'company'      => $this->company,
            'location'     => $this->location,
            'type'         => $this->type,
            'salary'       => $this->salary,
            'deadline'     => $this->deadline?->toDateString(),
            'status'       => $this->status,
            'poster'       => $this->poster
                                ? asset('storage/' . $this->poster)
                                : null,
            'logo'         => $this->logo
                                ? asset('storage/' . $this->logo)
                                : null,
            'link_apply'   => $this->link_apply,
            'category'     => $this->whenLoaded('category', fn() => [
                'id'   => $this->category?->id,
                'name' => $this->category?->name,
            ]),
            'major'        => $this->whenLoaded('major', fn() => [
                'id'   => $this->major?->id,
                'name' => $this->major?->name,
            ]),
            'posted_by'    => $this->whenLoaded('user', fn() => [
                'id'   => $this->user?->id,
                'name' => $this->user?->name,
            ]),
            'applications_count' => $this->when(
                isset($this->applications_count),
                $this->applications_count
            ),
            'is_bookmarked' => $this->when(
                isset($this->is_bookmarked),
                (bool) $this->is_bookmarked
            ),
            'created_at'   => $this->created_at?->toDateTimeString(),
            'updated_at'   => $this->updated_at?->toDateTimeString(),
        ];
    }
}
