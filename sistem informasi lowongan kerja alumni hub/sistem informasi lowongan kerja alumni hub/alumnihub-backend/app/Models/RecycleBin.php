<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecycleBin extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'job_id',
        'deleted_at',
        'restored_at',
    ];

    protected function casts(): array
    {
        return [
            'deleted_at'  => 'datetime',
            'restored_at' => 'datetime',
            'created_at'  => 'datetime',
        ];
    }

    // ───── Relationships ─────
    public function job()
    {
        return $this->belongsTo(Job::class)->withTrashed();
    }
}
