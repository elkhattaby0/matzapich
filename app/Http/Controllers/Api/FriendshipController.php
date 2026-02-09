<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Friendship;
use Carbon\Carbon;

class FriendshipController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'addressee_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();
        $addresseeId = (int) $request->addressee_id;

        if ($addresseeId === $user->id) {
            return response()->json([
                'error' => 'You cannot add yourself as a friend.',
            ], 422);
        }

        $exists = Friendship::where(function ($q) use ($user, $addresseeId) {
                $q->where('requester_id', $user->id)
                  ->where('addressee_id', $addresseeId);
            })
            ->orWhere(function ($q) use ($user, $addresseeId) {
                $q->where('requester_id', $addresseeId)
                  ->where('addressee_id', $user->id);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'error' => 'Friendship or request already exists.',
            ], 422);
        }

        $friendship = Friendship::create([
            'requester_id' => $user->id,
            'addressee_id' => $addresseeId,
            'status'       => 'pending',
        ]);

        return response()->json([
            'message'    => 'Friend request sent.',
            'friendship' => $friendship,
        ]);
    }

    public function accept(Request $request, Friendship $friendship)
    {
        $user = $request->user();

        if ($friendship->addressee_id !== $user->id) {
            return response()->json(['error' => 'Not allowed'], 403);
        }

        $friendship->update(['status' => 'accepted']);

        return response()->json(['message' => 'Friend request accepted.']);
    }

    public function reject(Request $request, Friendship $friendship)
    {
        $user = $request->user();

        if ($friendship->addressee_id !== $user->id) {
            return response()->json(['error' => 'Not allowed'], 403);
        }

        $friendship->update(['status' => 'rejected']);

        return response()->json(['message' => 'Friend request rejected.']);
    }

    public function destroy(Request $request, Friendship $friendship)
    {
        $user = $request->user();

        if ($friendship->requester_id !== $user->id && $friendship->addressee_id !== $user->id) {
            return response()->json(['error' => 'Not allowed'], 403);
        }

        $friendship->delete();

        return response()->json(['message' => 'Friendship removed.']);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $friendships = Friendship::where('status', 'accepted')
            ->where(function ($q) use ($user) {
                $q->where('requester_id', $user->id)
                  ->orWhere('addressee_id', $user->id);
            })
            ->get();

        $friendIds = $friendships->map(function (Friendship $f) use ($user) {
            return $f->requester_id === $user->id ? $f->addressee_id : $f->requester_id;
        })->values();

        $friends = User::whereIn('id', $friendIds)->get();

        $result = $friends->map(function (User $friend) use ($user) {
            return [
                'id'           => $friend->id,
                'firstName'    => $friend->firstName,
                'lastName'     => $friend->lastName,
                'avatar'       => $friend->avatar,
                'mutual_count' => $this->getMutualFriendsCount($user, $friend),
            ];
        })->values();

        return response()->json($result);
    }

    public function requests(Request $request)
    {
        $user = $request->user();

        $pending = Friendship::where('status', 'pending')
            ->where('addressee_id', $user->id)
            ->with('requester')
            ->get()
            ->map(function (Friendship $friendship) {
                return [
                    'id'         => $friendship->id,
                    'requester'  => [
                        'id'        => $friendship->requester->id,
                        'firstName' => $friendship->requester->firstName,
                        'lastName'  => $friendship->requester->lastName,
                        'avatar'    => $friendship->requester->avatar,
                    ],
                    'status'     => $friendship->status,
                    'created_at' => $friendship->created_at,
                ];
            })
            ->values();

        return response()->json($pending);
    }

    public function suggestions(Request $request)
    {
        $user = $request->user();

        $friendsIds = $this->getFriendsIds($user);

        $pendingIds = Friendship::where('status', 'pending')
            ->where(function ($q) use ($user) {
                $q->where('requester_id', $user->id)
                  ->orWhere('addressee_id', $user->id);
            })
            ->get()
            ->map(function (Friendship $f) use ($user) {
                return $f->requester_id === $user->id ? $f->addressee_id : $f->requester_id;
            })
            ->values()
            ->all();

        $excludeIds = array_unique(array_merge(
            [$user->id],
            $friendsIds,
            $pendingIds
        ));


        $candidates = User::whereNotIn('id', $excludeIds)
            ->limit(20)
            ->get();

        $result = $candidates->map(function (User $candidate) use ($user) {
            return [
                'id'                   => $candidate->id,
                'firstName'            => $candidate->firstName,
                'lastName'             => $candidate->lastName,
                'avatar'               => $candidate->avatar,
                'mutual_friends_count' => $this->getMutualFriendsCount($user, $candidate),
            ];
        })->values();

        return response()->json($result);
    }

    public function birthdays(Request $request)
    {
        $user = $request->user();

        $friendIds = $this->getFriendsIds($user);

        if (empty($friendIds)) {
            return response()->json([]);
        }

        $now = Carbon::now();
        $month = $now->month;

        $friends = User::whereIn('id', $friendIds)
            ->whereMonth('birthdate', $month)
            ->get();

        $result = $friends->map(function (User $friend) {
            return [
                'id'         => $friend->id,
                'firstName'  => $friend->firstName,
                'lastName'   => $friend->lastName,
                'avatar'     => $friend->avatar,
                'birthdate'  => $friend->birthdate,
            ];
        })->values();

        return response()->json($result);
    }

    // Helpers

    protected function getFriendsIds(User $user): array
    {
        $friendships = Friendship::where('status', 'accepted')
            ->where(function ($q) use ($user) {
                $q->where('requester_id', $user->id)
                  ->orWhere('addressee_id', $user->id);
            })
            ->get();

        return $friendships->map(function (Friendship $f) use ($user) {
            return $f->requester_id === $user->id ? $f->addressee_id : $f->requester_id;
        })->values()->all();
    }

    protected function getMutualFriendsCount(User $user, User $other): int
    {
        $userFriends = $this->getFriendsIds($user);
        $otherFriends = $this->getFriendsIds($other);

        return count(array_intersect($userFriends, $otherFriends));
    }
}
