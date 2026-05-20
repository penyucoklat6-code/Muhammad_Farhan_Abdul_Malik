<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\ReviewJobRequest;
use App\Models\Job;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobReviewController extends Controller
{
    public function __construct(private NotificationService $notifService) {}

    // ─────────────────────────────────────────────
    // GET /api/reviews/pending  (Kaprodi)
    // ─────────────────────────────────────────────
    public function pending(Request $request): JsonResponse
    {
        $jobs = Job::with(['user:id,name,email', 'category:id,name', 'major:id,name'])
            ->pending()
            ->latest()
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $jobs,
        ]);
    }

    // ─────────────────────────────────────────────
    // POST /api/reviews/{jobId}  (Kaprodi)
    // ─────────────────────────────────────────────
    public function review(ReviewJobRequest $request, int $jobId): JsonResponse
    {
        $job = Job::with('user')->find($jobId);

        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Lowongan tidak ditemukan.'], 404);
        }

        if ($job->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya lowongan berstatus pending yang dapat direview.',
            ], 422);
        }

        // Tentukan status lowongan berdasarkan keputusan
        $newJobStatus = match ($request->status) {
            'approve'  => 'published',
            'rejected' => 'rejected',
            'revision' => 'revision',
        };

        // Simpan review
        $review = $job->reviews()->create([
            'kaprodi_id'  => $request->user()->id,
            'status'      => $request->status,
            'reason'      => $request->reason,
            'reviewed_at' => now(),
        ]);

        // Update status lowongan
        $job->update(['status' => $newJobStatus]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'review_job',
            'description' => "Kaprodi memberikan review ({$request->status}) untuk lowongan: {$job->title}",
            'ip_address' => $request->ip()
        ]);

        // Kirim notifikasi ke pembuat lowongan
        $this->notifService->jobReviewed($job, $review);

        $statusLabel = match ($request->status) {
            'approve'  => 'disetujui dan dipublikasikan',
            'rejected' => 'ditolak',
            'revision' => 'dikembalikan untuk revisi',
        };

        return response()->json([
            'success' => true,
            'message' => "Lowongan berhasil {$statusLabel}.",
            'data'    => [
                'job'    => $job->fresh(),
                'review' => $review,
            ],
        ]);
    }

    // ─────────────────────────────────────────────
    // GET /api/reviews/history  (Kaprodi)
    // ─────────────────────────────────────────────
    public function history(Request $request): JsonResponse
    {
        $reviews = \App\Models\JobReview::with(['job:id,title,company,status', 'kaprodi:id,name'])
            ->where('kaprodi_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $reviews,
        ]);
    }

    // ─────────────────────────────────────────────
    // GET /api/reviews/all-jobs  (Kaprodi — semua status)
    // ─────────────────────────────────────────────
    public function allJobs(Request $request): JsonResponse
    {
        $query = Job::with(['user:id,name', 'category:id,name', 'latestReview']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $jobs = $query->latest()->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $jobs,
        ]);
    }
}
