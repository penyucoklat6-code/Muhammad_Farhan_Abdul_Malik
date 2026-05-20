<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\RecycleBin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecycleBinController extends Controller
{
    // GET /api/recycle-bin  (Kaprodi)
    public function index(Request $request): JsonResponse
    {
        $items = RecycleBin::with(['job' => function ($q) {
            $q->withTrashed()->with(['user:id,name', 'category:id,name']);
        }])
        ->whereNull('restored_at')
        ->latest('deleted_at')
        ->paginate(10);

        return response()->json(['success' => true, 'data' => $items]);
    }

    // POST /api/recycle-bin/{id}/restore  (Kaprodi)
    public function restore(int $id): JsonResponse
    {
        $item = RecycleBin::find($id);
        if (!$item) {
            return response()->json(['success' => false, 'message' => 'Item tidak ditemukan.'], 404);
        }

        $job = Job::withTrashed()->find($item->job_id);
        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Lowongan tidak ditemukan.'], 404);
        }

        // Restore soft delete
        $job->restore();
        $job->update(['status' => 'pending']); // Reset ke pending setelah restore

        $item->update(['restored_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Lowongan berhasil dipulihkan dan dikembalikan ke status pending.',
            'data'    => $job->fresh(),
        ]);
    }

    // DELETE /api/recycle-bin/{id}  (Kaprodi — hapus permanen)
    public function permanentDelete(int $id): JsonResponse
    {
        $item = RecycleBin::find($id);
        if (!$item) {
            return response()->json(['success' => false, 'message' => 'Item tidak ditemukan.'], 404);
        }

        $job = Job::withTrashed()->find($item->job_id);
        if ($job) {
            // Hapus file poster dan logo
            if ($job->poster) Storage::disk('public')->delete($job->poster);
            if ($job->logo)   Storage::disk('public')->delete($job->logo);

            // Hapus permanen dari database
            $job->forceDelete();
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lowongan dihapus secara permanen.',
        ]);
    }
}
