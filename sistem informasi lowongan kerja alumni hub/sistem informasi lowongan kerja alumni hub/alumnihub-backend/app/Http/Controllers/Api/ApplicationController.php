<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(private NotificationService $notifService) {}

    // ─────────────────────────────────────────────
    // POST /api/applications/{jobId}  (Mahasiswa — 1-Click Apply)
    // ─────────────────────────────────────────────
    public function store(Request $request, int $jobId): JsonResponse
    {
        $user = $request->user();
        $job  = Job::published()->find($jobId);

        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Lowongan tidak ditemukan atau belum dipublikasikan.'], 404);
        }

        // Cek deadline
        if ($job->deadline && now()->gt($job->deadline)) {
            return response()->json(['success' => false, 'message' => 'Lowongan sudah melewati batas waktu pendaftaran.'], 422);
        }

        // Cek sudah melamar sebelumnya
        $alreadyApplied = Application::where('user_id', $user->id)
            ->where('job_id', $jobId)
            ->exists();

        if ($alreadyApplied) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah pernah melamar pada lowongan ini.',
            ], 422);
        }

        // Ambil CV dari profil mahasiswa (tipe = 'cv')
        $cvDoc = $user->documents()->where('type', 'cv')->latest()->first();
        $cvPath = $cvDoc ? $cvDoc->file_path : null;

        // Buat lamaran — CV otomatis dari profil
        $application = Application::create([
            'user_id'    => $user->id,
            'job_id'     => $jobId,
            'cv_path'    => $cvPath ?? '',
            'status'     => 'dikirim',
            'applied_at' => now(),
        ]);

        // Notifikasi ke mahasiswa (email + in-app)
        $this->notifService->applicationSubmitted($application);

        // Notifikasi ke pembuat lowongan
        $this->notifService->newApplication($application);

        // Activity log
        \App\Models\ActivityLog::create([
            'user_id'     => $user->id,
            'action'      => 'apply_job',
            'description' => "Melamar pada lowongan: {$job->title} ({$job->company})",
            'ip_address'  => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lamaran berhasil dikirim! Notifikasi telah dikirim ke email Anda.',
            'data'    => $application->load('job:id,title,company'),
        ], 201);
    }

    // ─────────────────────────────────────────────
    // GET /api/my-applications  (Mahasiswa)
    // ─────────────────────────────────────────────
    public function myApplications(Request $request): JsonResponse
    {
        $applications = Application::with(['job:id,title,company,location,type,logo,status,deadline'])
            ->where('user_id', $request->user()->id)
            ->orderBy('applied_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $applications,
        ]);
    }

    // ─────────────────────────────────────────────
    // GET /api/jobs/{jobId}/applications  (Kaprodi/Owner)
    // Termasuk data profil lengkap pelamar
    // ─────────────────────────────────────────────
    public function jobApplications(Request $request, int $jobId): JsonResponse
    {
        $user = $request->user();
        $job  = Job::find($jobId);

        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Lowongan tidak ditemukan.'], 404);
        }

        // Hanya Kaprodi atau owner yang bisa lihat
        if (!$user->isKaprodi() && $job->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        $applications = Application::with([
                'user:id,name,email,phone,gender,address,domicile_address,fakultas,jurusan,avatar',
                'user.documents',
                'user.languages',
            ])
            ->where('job_id', $jobId)
            ->orderBy('applied_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data'    => $applications,
        ]);
    }

    // ─────────────────────────────────────────────
    // PUT /api/applications/{id}/status  (Kaprodi/Owner)
    // Tahapan: dikirim → interview → diterima/ditolak
    // ─────────────────────────────────────────────
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:interview,diterima,ditolak'],
        ]);

        $application = Application::with(['user', 'job'])->find($id);

        if (!$application) {
            return response()->json(['success' => false, 'message' => 'Lamaran tidak ditemukan.'], 404);
        }

        $user = $request->user();

        // Hanya Kaprodi atau owner lowongan
        if (!$user->isKaprodi() && $application->job->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        // Validasi alur tahapan
        $currentStatus = $application->status;
        $newStatus = $request->status;

        // Aturan: dikirim → interview, interview → diterima/ditolak
        $allowedTransitions = [
            'dikirim'   => ['interview', 'ditolak'],
            'interview' => ['diterima', 'ditolak'],
        ];

        if (!isset($allowedTransitions[$currentStatus]) || !in_array($newStatus, $allowedTransitions[$currentStatus])) {
            return response()->json([
                'success' => false,
                'message' => "Tidak bisa mengubah status dari '{$currentStatus}' ke '{$newStatus}'.",
            ], 422);
        }

        $application->update([
            'status'     => $newStatus,
            'updated_at' => now(),
        ]);

        // Kirim notifikasi email + in-app ke pelamar
        $this->notifService->applicationStatusUpdated($application);

        // Activity log
        \App\Models\ActivityLog::create([
            'user_id'     => $user->id,
            'action'      => 'update_application_status',
            'description' => "Mengubah status lamaran {$application->user->name} ke '{$newStatus}' pada lowongan: {$application->job->title}",
            'ip_address'  => $request->ip(),
        ]);

        $statusLabel = match ($newStatus) {
            'interview' => 'dipanggil interview',
            'diterima'  => 'diterima',
            'ditolak'   => 'ditolak',
        };

        return response()->json([
            'success' => true,
            'message' => "Pelamar berhasil {$statusLabel}.",
            'data'    => $application->fresh(),
        ]);
    }
}
