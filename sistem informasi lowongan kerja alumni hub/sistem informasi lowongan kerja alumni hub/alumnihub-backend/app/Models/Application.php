<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'job_id',
        'cv_path',
        'portfolio_path',
        'status',
        'applied_at',
        'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'applied_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    // ───── Relationships ─────
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    // ───── Helpers ─────
    public function statusLabel(): string
    {
        return match ($this->status) {
            'dikirim'   => 'Dikirim',
            'interview' => 'Interview',
            'diterima'  => 'Diterima',
            'ditolak'   => 'Ditolak',
            default     => ucfirst($this->status),
        };
    }

    public function statusColor(): string
    {
        return match ($this->status) {
            'dikirim'   => 'info',
            'interview' => 'warning',
            'diterima'  => 'success',
            'ditolak'   => 'danger',
            default     => 'secondary',
        };
    }
}
