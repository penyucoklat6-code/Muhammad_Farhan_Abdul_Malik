<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobReview extends Model
{
    protected $fillable = [
        'job_id',
        'kaprodi_id',
        'status',
        'reason',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    // ───── Relationships ─────
    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function kaprodi()
    {
        return $this->belongsTo(User::class, 'kaprodi_id');
    }
}
