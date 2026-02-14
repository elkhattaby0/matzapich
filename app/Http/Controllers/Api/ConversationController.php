<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function start(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $authUser = $request->user();
        $otherUserId = (int) $request->user_id;

        if ($authUser->id === $otherUserId) {
            return response()->json(['message' => 'Cannot start conversation with yourself'], 422);
        }

        $existing = Conversation::where('type', 'private')
            ->whereHas('participants', function ($q) use ($authUser) {
                $q->where('users.id', $authUser->id);
            })
            ->whereHas('participants', function ($q) use ($otherUserId) {
                $q->where('users.id', $otherUserId);
            })
            ->with(['participants:id,firstName,lastName,avatar'])
            ->first();

        if ($existing) {
            return response()->json([
                'conversation' => $existing,
                'existing' => true,
            ]);
        }

        $conversation = Conversation::create(['type' => 'private']);
        $conversation->participants()->attach([$authUser->id, $otherUserId]);

        return response()->json([
            'conversation' => $conversation->load('participants:id,firstName,lastName,avatar'),
            'existing' => false,
        ]);
    }

    public function userConversations(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'user_id' => null,
                'conversations' => [],
            ]);
        }

        $conversations = Conversation::join(
                'conversation_participants',
                'conversations.id',
                '=',
                'conversation_participants.conversation_id'
            )
            ->where('conversation_participants.user_id', $user->id)
            ->select('conversations.*')
            ->distinct()
            ->orderBy('conversations.updated_at', 'desc')
            ->with(['participants:id,firstName,lastName,avatar'])
            ->get();

        return response()->json([
            'user_id' => $user->id,
            'conversations' => $conversations,
        ]);
    }
}
