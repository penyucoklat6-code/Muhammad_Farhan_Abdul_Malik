<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Get list of users available to chat with.
     * Mahasiswa sees kaprodi users, kaprodi sees mahasiswa users.
     */
    public function getUsers()
    {
        $user = Auth::user();
        $targetRole = $user->role === 'kaprodi' ? 'mahasiswa' : 'kaprodi';

        $users = User::where('role', $targetRole)
            ->select('id', 'name', 'role', 'avatar')
            ->get()
            ->map(function ($u) use ($user) {
                $unread = Message::where('sender_id', $u->id)
                    ->where('receiver_id', $user->id)
                    ->where('is_read', false)
                    ->count();

                $lastMessage = Message::where(function ($q) use ($user, $u) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $u->id);
                })->orWhere(function ($q) use ($user, $u) {
                    $q->where('sender_id', $u->id)->where('receiver_id', $user->id);
                })->latest()->first();

                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'role' => $u->role,
                    'avatar' => $u->avatar,
                    'unread_count' => $unread,
                    'last_message' => $lastMessage ? $lastMessage->message : null,
                    'last_message_at' => $lastMessage ? $lastMessage->created_at->toISOString() : null,
                ];
            })
            ->sortByDesc('last_message_at')
            ->values();

        return response()->json(['success' => true, 'data' => $users]);
    }

    /**
     * Get conversation messages between current user and another user.
     */
    public function getMessages($userId)
    {
        $authId = Auth::id();

        $messages = Message::where(function ($q) use ($authId, $userId) {
            $q->where('sender_id', $authId)->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($authId, $userId) {
            $q->where('sender_id', $userId)->where('receiver_id', $authId);
        })
        ->orderBy('created_at', 'asc')
        ->limit(100)
        ->get()
        ->map(function ($msg) use ($authId) {
            return [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'receiver_id' => $msg->receiver_id,
                'message' => $msg->message,
                'is_mine' => $msg->sender_id === $authId,
                'is_read' => $msg->is_read,
                'created_at' => $msg->created_at->toISOString(),
            ];
        });

        return response()->json(['success' => true, 'data' => $messages]);
    }

    /**
     * Send a message.
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:2000',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
                'message' => $message->message,
                'is_mine' => true,
                'is_read' => false,
                'created_at' => $message->created_at->toISOString(),
            ]
        ], 201);
    }

    /**
     * Mark all messages from a user as read.
     */
    public function markAsRead($userId)
    {
        Message::where('sender_id', $userId)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Get total unread message count for current user.
     */
    public function unreadCount()
    {
        $count = Message::where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return response()->json(['success' => true, 'data' => ['count' => $count]]);
    }
}
