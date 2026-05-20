<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    // ─────────────────────────────────────────────
    // GET /api/bookmarks  (Mahasiswa)
    // ─────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $bookmarks = Bookmark::with([
            'job:id,title,company,location,type,logo,deadline,status',
            'job.category:id,name',
        ])
        ->where('user_id', $request->user()->id)
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $bookmarks,
        ]);
    }

    // ─────────────────────────────────────────────
    // POST /api/bookmarks/{jobId}  (Mahasiswa)
    // ─────────────────────────────────────────────
    public function store(Request $request, int $jobId): JsonResponse
    {
        $user = $request->user();
        $job  = Job::published()->find($jobId);

        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Lowongan tidak ditemukan.'], 404);
        }

        // Cek sudah di-bookmark
        $exists = Bookmark::where('user_id', $user->id)->where('job_id', $jobId)->exists();
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Lowongan sudah ada di daftar bookmark Anda.',
            ], 422);
        }

        $bookmark = Bookmark::create([
            'user_id' => $user->id,
            'job_id'  => $jobId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lowongan berhasil disimpan ke bookmark.',
            'data'    => $bookmark,
        ], 201);
    }

    // ─────────────────────────────────────────────
    // DELETE /api/bookmarks/{jobId}  (Mahasiswa)
    // ─────────────────────────────────────────────
    public function destroy(Request $request, int $jobId): JsonResponse
    {
        $deleted = Bookmark::where('user_id', $request->user()->id)
            ->where('job_id', $jobId)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Bookmark tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Bookmark berhasil dihapus.',
        ]);
    }
}
