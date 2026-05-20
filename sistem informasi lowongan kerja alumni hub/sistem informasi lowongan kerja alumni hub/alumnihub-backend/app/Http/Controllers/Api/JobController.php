<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Models\Job;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobController extends Controller
{
    public function __construct(private NotificationService $notifService) {}

    // ─────────────────────────────────────────────
    // GET /api/jobs  (Public — search & filter)
    // ─────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $query = Job::with(['user:id,name,role', 'category:id,name', 'major:id,name'])
            ->published();

        // Search keyword
        if ($request->filled('keyword')) {
            $query->search($request->keyword);
        }

        // Filter lokasi
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filter tipe kerja
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter kategori
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter jurusan
        if ($request->filled('major_id')) {
            $query->where('major_id', $request->major_id);
        }

        // Sort
        $sortBy  = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $allowedSorts = ['created_at', 'deadline', 'title', 'company'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $jobs = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $jobs,
        ]);
    }

    // ─────────────────────────────────────────────
    // GET /api/jobs/{id}  (Public)
    // ─────────────────────────────────────────────
    public function show(int $id): JsonResponse
    {
        $job = Job::with([
            'user:id,name,email',
            'category:id,name',
            'major:id,name',
            'latestReview',
        ])->find($id);

        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Lowongan tidak ditemukan.'], 404);
        }

        // Public hanya bisa lihat yang published
        if ($job->status !== 'published') {
            // Kecuali owner atau kaprodi (cek jika ada auth)
            $authUser = request()->user();
            if (!$authUser || ($authUser->id !== $job->user_id && !$authUser->isKaprodi())) {
                return response()->json(['success' => false, 'message' => 'Lowongan tidak tersedia.'], 404);
            }
        }

        return response()->json([
            'success' => true,
            'data'    => $job,
        ]);
    }

    // ─────────────────────────────────────────────
    // POST /api/jobs  (Auth — Mahasiswa & Kaprodi)
    // ─────────────────────────────────────────────
    public function store(StoreJobRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        
        // Kaprodi jobs are auto-published, Mahasiswa jobs are pending
        $data['status']  = $request->user()->isKaprodi() ? 'published' : 'pending';

        // Upload poster
        if ($request->hasFile('poster')) {
            $data['poster'] = $request->file('poster')->store('jobs/posters', 'public');
        }

        // Upload logo
        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('jobs/logos', 'public');
        }

        $job = Job::create($data);
        $job->load(['category:id,name', 'major:id,name']);

        // Notifikasi ke pembuat
        $this->notifService->jobSubmitted($request->user(), $job);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'create_job',
            'description' => "Membuat lowongan baru: {$job->title}",
            'ip_address' => $request->ip()
        ]);


        // Notifikasi ke semua Kaprodi (hanya jika pending)
        if ($data['status'] === 'pending') {
            $this->notifService->newJobPending($job);
        }

        return response()->json([
            'success' => true,
            'message' => $data['status'] === 'published' 
                         ? 'Lowongan berhasil diterbitkan.' 
                         : 'Lowongan berhasil dikirim dan menunggu persetujuan Kaprodi.',
            'data'    => $job,
        ], 201);
    }

    // ─────────────────────────────────────────────
    // PUT /api/jobs/{id}  (Auth — Owner)
    // ─────────────────────────────────────────────
    public function update(UpdateJobRequest $request, int $id): JsonResponse
    {
        $job = Job::find($id);

        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Lowongan tidak ditemukan.'], 404);
        }

        // Hanya owner ATAU kaprodi yang bisa edit
        if ($job->user_id !== $request->user()->id && !$request->user()->isKaprodi()) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        // Tidak bisa edit jika sudah published (kecuali Kaprodi yang bebas mengedit kapan saja)
        if ($job->status === 'published' && !$request->user()->isKaprodi()) {
            return response()->json([
                'success' => false,
                'message' => 'Lowongan yang sudah dipublikasikan tidak bisa diedit. Tutup lowongan terlebih dahulu.',
            ], 422);
        }

        $data = $request->validated();

        // Update poster jika ada file baru
        if ($request->hasFile('poster')) {
            if ($job->poster) Storage::disk('public')->delete($job->poster);
            $data['poster'] = $request->file('poster')->store('jobs/posters', 'public');
        }

        // Update logo jika ada file baru
        if ($request->hasFile('logo')) {
            if ($job->logo) Storage::disk('public')->delete($job->logo);
            $data['logo'] = $request->file('logo')->store('jobs/logos', 'public');
        }

        // Jika status revision, reset ke pending setelah edit
        if ($job->status === 'revision') {
            $data['status'] = 'pending';
        }

        $job->update($data);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update_job',
            'description' => "Memperbarui lowongan: {$job->title}",
            'ip_address' => $request->ip()
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Lowongan berhasil diperbarui.',
            'data'    => $job->fresh(['category:id,name', 'major:id,name']),
        ]);
    }

    // ─────────────────────────────────────────────
    // DELETE /api/jobs/{id}  (Auth — Owner/Kaprodi)
    // ─────────────────────────────────────────────
    public function destroy(Request $request, int $id): JsonResponse
    {
        $job  = Job::find($id);
        $user = $request->user();

        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Lowongan tidak ditemukan.'], 404);
        }

        // Hanya owner atau kaprodi
        if ($job->user_id !== $user->id && !$user->isKaprodi()) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        // Catat ke recycle bin, lalu soft delete
        $job->recycleBin()->create(['deleted_at' => now()]);
        
        \App\Models\ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'delete_job',
            'description' => "Menghapus lowongan: {$job->title}",
            'ip_address' => $request->ip()
        ]);
        
        $job->delete(); // SoftDelete

        return response()->json([
            'success' => true,
            'message' => 'Lowongan dipindahkan ke Recycle Bin.',
        ]);
    }

    // ─────────────────────────────────────────────
    // GET /api/my-jobs  (Auth — own jobs only)
    // ─────────────────────────────────────────────
    public function myJobs(Request $request): JsonResponse
    {
        $jobs = Job::with(['category:id,name', 'major:id,name', 'latestReview'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $jobs,
        ]);
    }
}
