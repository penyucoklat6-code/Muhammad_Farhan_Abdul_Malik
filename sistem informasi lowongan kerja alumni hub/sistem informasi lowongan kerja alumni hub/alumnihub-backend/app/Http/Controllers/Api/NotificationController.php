<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        $unreadCount = Notification::where('user_id', $request->user()->id)
            ->where('is_read', 0)->count();

        return response()->json([
            'success'      => true,
            'unread_count' => $unreadCount,
            'data'         => $notifications,
        ]);
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)->find($id);
        if (!$notification) {
            return response()->json(['success' => false, 'message' => 'Notifikasi tidak ditemukan.'], 404);
        }
        $notification->update(['is_read' => 1]);
        return response()->json(['success' => true, 'message' => 'Notifikasi ditandai sudah dibaca.']);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)->where('is_read', 0)->update(['is_read' => 1]);
        return response()->json(['success' => true, 'message' => 'Semua notifikasi ditandai sudah dibaca.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $deleted = Notification::where('user_id', $request->user()->id)->where('id', $id)->delete();
        if (!$deleted) {
            return response()->json(['success' => false, 'message' => 'Notifikasi tidak ditemukan.'], 404);
        }
        return response()->json(['success' => true, 'message' => 'Notifikasi berhasil dihapus.']);
    }
}
