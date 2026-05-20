<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'nim',
        'nip',
        'email',
        'password',
        'role',
        'gender',
        'phone',
        'address',
        'domicile_address',
        'fakultas',
        'jurusan',
        'avatar',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // ───── Helpers ─────
    public function isMahasiswa(): bool
    {
        return $this->role === 'mahasiswa';
    }

    public function isKaprodi(): bool
    {
        return $this->role === 'kaprodi';
    }

    // ───── Relationships ─────
    public function otpVerifications()
    {
        return $this->hasMany(OtpVerification::class);
    }

    public function latestOtp()
    {
        return $this->hasOne(OtpVerification::class)->latestOfMany();
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    public function jobReviews()
    {
        return $this->hasMany(JobReview::class, 'kaprodi_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function bookmarkedJobs()
    {
        return $this->belongsToMany(Job::class, 'bookmarks')->withTimestamps();
    }

    public function documents()
    {
        return $this->hasMany(UserDocument::class);
    }

    public function languages()
    {
        return $this->hasMany(UserLanguage::class);
    }
}
