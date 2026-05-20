<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    protected $fillable = [
        'name',
    ];

    // ───── Relationships ─────
    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}
