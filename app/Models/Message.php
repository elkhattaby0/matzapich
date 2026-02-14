<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'content_encrypted',
        'media_url',
        'is_read',
    ];

    protected $casts = ['is_read' => 'boolean'];

    protected $hidden = [
        'content_encrypted',
    ];

    protected $appends = [
        'content',
    ];

    public function getContentAttribute()
    {
        if (! isset($this->attributes['content_encrypted'])) {
            return null;
        }

        try {
            return Crypt::decryptString($this->attributes['content_encrypted']);
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function setContentAttribute($value)
    {
        $this->attributes['content_encrypted'] = $value
            ? Crypt::encryptString($value)
            : null;
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
