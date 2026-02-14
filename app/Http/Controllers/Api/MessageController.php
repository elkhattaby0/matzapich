<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    // List all messages of a conversation for an authorized user
    public function index(Conversation $conversation, Request $request)
    {
        $user = $request->user();

        // Security: only participants can see messages
        if (! $conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // No pagination for now: always return full history sorted by time
        $messages = $conversation->messages()
            ->with('sender:id,firstName,lastName,avatar')
            ->orderBy('created_at', 'asc')
            ->get();

        $messages->transform(function ($msg) {
            $msg->makeHidden(['content_encrypted']);
            $msg->append('content'); // decrypted accessor
            return $msg;
        });

        return response()->json([
            'data' => $messages,
        ]);
    }

    // Store a new message in a conversation
    public function store(Conversation $conversation, Request $request)
    {
        $user = $request->user();

        if (! $conversation->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'content'   => $data['content'],
        ]);

        $message->load('sender:id,firstName,lastName,avatar');
        $message->append('content');

        // Realtime broadcast to other participants. Do not fail message send
        // if websocket infrastructure is unavailable.
        try {
            broadcast(new MessageSent($message))->toOthers();
        } catch (\Throwable $e) {
            Log::warning('Message broadcast failed', [
                'conversation_id' => $conversation->id,
                'message_id' => $message->id,
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => $message,
        ], 201);
    }
}
