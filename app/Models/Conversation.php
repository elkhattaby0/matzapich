<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = ['type'];

    // Relations
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'conversation_participants');
    }

    // Helper: create private conversation
    public static function createPrivate($user1, $user2)
    {
        $conversation = static::create(['type' => 'private']);
        $conversation->participants()->attach([$user1->id, $user2->id]);
        return $conversation;
    }

    public static function startPrivateBetween($userAId, $userBId)
    {
        $conversation = static::create(['type' => 'private']);

        $conversation->participants()->attach([
            $userAId,
            $userBId,
        ]);

        return $conversation;
    }

}
