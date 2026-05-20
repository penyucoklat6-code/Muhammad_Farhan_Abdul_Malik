<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read'    => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    // ───── Scopes ─────
    public function scopeUnread($query)
    {
        return $query->where('is_read', 0);
    }

    // ───── Relationships ─────
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
