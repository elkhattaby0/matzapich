<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstName',
        'lastName',
        'dateOfBirth',
        'gender',
        'phone',
        'email',
        'password',
        'avatar',
        'is_admin',
        'is_banned',
        'bio',           // short intro
        'socialStatus',  // e.g. Single, Married
        'from',          // hometown
        'livesIn',       // current city
        'work',          // workplace
        'studied',       // school/university
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'dateOfBirth'       => 'date:Y-m-d',
        'is_admin'          => 'boolean',
        'is_banned'         => 'boolean',
        // no 'password' => 'hashed' since we hash manually in controller
    ];

    /**
     * Accessors & relationships
     */

    public function getFormattedDateOfBirthAttribute()
    {
        return $this->dateOfBirth ? $this->dateOfBirth->format('d/m/Y') : null;
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function sentFriendRequests()
    {
        return $this->hasMany(Friendship::class, 'requester_id');
    }

    public function receivedFriendRequests()
    {
        return $this->hasMany(Friendship::class, 'addressee_id');
    }

    public function pendingSentFriendRequests()
    {
        return $this->sentFriendRequests()->where('status', 'pending');
    }

    public function pendingReceivedFriendRequests()
    {
        return $this->receivedFriendRequests()->where('status', 'pending');
    }

    public function friendsFromMe()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'requester_id',
            'addressee_id'
        )->wherePivot('status', 'accepted');
    }

    public function friendsToMe()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'addressee_id',
            'requester_id'
        )->wherePivot('status', 'accepted');
    }

    public function getFriendsAttribute()
    {
        return $this->friendsFromMe->merge($this->friendsToMe);
    }
}
