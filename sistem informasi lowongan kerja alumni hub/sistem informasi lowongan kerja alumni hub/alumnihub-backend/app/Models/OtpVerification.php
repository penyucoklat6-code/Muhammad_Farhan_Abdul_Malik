<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'otp_code',
        'expired_at',
        'is_verified',
    ];

    protected function casts(): array
    {
        return [
            'expired_at'   => 'datetime',
            'is_verified'  => 'boolean',
            'created_at'   => 'datetime',
        ];
    }

    // ───── Helpers ─────
    public function isExpired(): bool
    {
        return now()->gt($this->expired_at);
    }

    public function isValid(): bool
    {
        return !$this->is_verified && !$this->isExpired();
    }

    // ───── Relationships ─────
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
