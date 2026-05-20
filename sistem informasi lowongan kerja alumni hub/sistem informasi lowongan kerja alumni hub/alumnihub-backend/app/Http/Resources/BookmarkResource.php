<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookmarkResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'created_at' => $this->created_at?->toDateTimeString(),
            'job'        => $this->whenLoaded('job', fn() => new JobResource($this->job)),
        ];
    }
}
