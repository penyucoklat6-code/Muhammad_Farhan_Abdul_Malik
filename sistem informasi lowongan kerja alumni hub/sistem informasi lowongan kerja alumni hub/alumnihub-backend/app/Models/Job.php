<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'requirements',
        'company',
        'location',
        'type',
        'work_arrangement',
        'salary',
        'salary_min',
        'salary_max',
        'deadline',
        'status',
        'poster',
        'logo',
        'link_apply',
        'external_link',
        'category_id',
        'major_id',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
        ];
    }

    // ───── Scopes ─────
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSearch($query, string $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
              ->orWhere('company', 'like', "%{$keyword}%")
              ->orWhere('description', 'like', "%{$keyword}%");
        });
    }

    // ───── Relationships ─────
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class);
    }

    public function reviews()
    {
        return $this->hasMany(JobReview::class);
    }

    public function latestReview()
    {
        return $this->hasOne(JobReview::class)->latestOfMany();
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function recycleBin()
    {
        return $this->hasOne(RecycleBin::class);
    }
}
