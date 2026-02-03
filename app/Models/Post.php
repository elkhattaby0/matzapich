<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'content',
        'media_path',
        'visibility',
        'video_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // app/Models/Post.php
    protected $appends = ['media_url', 'video_url'];
    
    public function getMediaUrlAttribute()
    {
        return $this->media_path
            ? asset('storage/'.$this->media_path)
            : null;
    }

    public function getVideoUrlAttribute()
    {
        return $this->video_path ? asset('storage/' . $this->video_path) : null;
    }

}
