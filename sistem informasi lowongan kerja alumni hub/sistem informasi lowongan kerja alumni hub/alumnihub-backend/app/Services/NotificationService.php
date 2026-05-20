<?php

namespace App\Services;

use App\Mail\ApplicationStatusMail;
use App\Mail\JobStatusMail;
use App\Models\Application;
use App\Models\Job;
use App\Models\JobReview;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Buat notifikasi in-app
     */
    public function create(User $user, string $title, string $message, string $type = 'in_app'): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'title'   => $title,
            'message' => $message,
            'type'    => $type,
        ]);
    }

    /**
     * Notifikasi OTP dikirim (in-app)
     */
    public function otpSent(User $user): void
    {
        $this->create(
            $user,
            'Kode OTP Dikirim',
            'Kode OTP verifikasi telah dikirim ke email Anda. Berlaku 10 menit.',
            'in_app'
        );
    }

    /**
     * Notifikasi lowongan berhasil dikirim (pending)
     */
    public function jobSubmitted(User $user, Job $job): void
    {
        $this->create(
            $user,
            'Lowongan Dikirim untuk Review',
            "Lowongan \"{$job->title}\" berhasil dikirim dan sedang menunggu persetujuan Kaprodi.",
            'in_app'
        );
    }

    /**
     * Notifikasi status review lowongan ke pembuat
     */
    public function jobReviewed(Job $job, JobReview $review): void
    {
        $poster = $job->user;
        $statusLabel = match ($review->status) {
            'approve'  => 'disetujui ✅',
            'rejected' => 'ditolak ❌',
            'revision' => 'perlu revisi ✏️',
            default    => 'diperbarui',
        };

        $message = "Lowongan \"{$job->title}\" Anda telah {$statusLabel}.";
        if ($review->reason) {
            $message .= " Catatan: {$review->reason}";
        }

        // In-app notification
        $this->create($poster, 'Status Lowongan Diperbarui', $message, 'in_app');

        // Email notification
        $this->create($poster, 'Email Notifikasi: Status Lowongan', $message, 'email');
        Mail::to($poster->email)->send(new JobStatusMail($job, $review));
    }

    /**
     * Notifikasi ke Kaprodi ada lowongan baru pending
     */
    public function newJobPending(Job $job): void
    {
        $kaprodiList = User::where('role', 'kaprodi')->get();
        foreach ($kaprodiList as $kaprodi) {
            $this->create(
                $kaprodi,
                'Lowongan Baru Menunggu Review',
                "Ada lowongan baru \"{$job->title}\" dari {$job->user->name} yang perlu direview.",
                'in_app'
            );
        }
    }

    /**
     * Notifikasi ke mahasiswa setelah berhasil melamar (EMAIL + IN-APP)
     */
    public function applicationSubmitted(Application $application): void
    {
        $application->loadMissing(['user', 'job']);
        $mahasiswa = $application->user;
        $job = $application->job;

        // In-app
        $this->create(
            $mahasiswa,
            'Lamaran Berhasil Dikirim ✅',
            "Lamaran Anda pada \"{$job->title}\" di {$job->company} berhasil dikirim. Pantau status lamaran Anda di halaman Lamaran Saya.",
            'in_app'
        );

        // Email
        $this->create($mahasiswa, 'Email: Lamaran Berhasil', "Lamaran pada \"{$job->title}\" berhasil dikirim.", 'email');
        Mail::to($mahasiswa->email)->send(new ApplicationStatusMail($application, $job));
    }

    /**
     * Notifikasi status lamaran ke mahasiswa (Interview/Accept/Reject) — EMAIL + IN-APP
     */
    public function applicationStatusUpdated(Application $application): void
    {
        $application->loadMissing(['user', 'job']);
        $mahasiswa = $application->user;
        $job       = $application->job;

        $statusLabel = match ($application->status) {
            'interview' => 'dipanggil untuk interview 📞',
            'diterima'  => 'diterima 🎉 Selamat!',
            'ditolak'   => 'ditolak ❌',
            default     => 'diperbarui',
        };

        $message = "Lamaran Anda pada \"{$job->title}\" di {$job->company} {$statusLabel}.";

        if ($application->status === 'interview') {
            $message .= " Silakan cek email Anda untuk informasi lebih lanjut.";
        }

        // In-app notification
        $this->create($mahasiswa, 'Status Lamaran Diperbarui', $message, 'in_app');

        // Email notification
        $this->create($mahasiswa, 'Email Notifikasi: Status Lamaran', $message, 'email');
        Mail::to($mahasiswa->email)->send(new ApplicationStatusMail($application, $job));
    }

    /**
     * Notifikasi ke pembuat lowongan ada pelamar baru
     */
    public function newApplication(Application $application): void
    {
        $application->loadMissing(['user', 'job.user']);
        $job    = $application->job;
        $poster = $job->user;

        $this->create(
            $poster,
            'Pelamar Baru 📩',
            "Ada pelamar baru ({$application->user->name}) pada lowongan \"{$job->title}\".",
            'in_app'
        );

        // Also notify all Kaprodi
        $kaprodiList = User::where('role', 'kaprodi')->where('id', '!=', $poster->id)->get();
        foreach ($kaprodiList as $kaprodi) {
            $this->create(
                $kaprodi,
                'Pelamar Baru 📩',
                "Ada pelamar baru ({$application->user->name}) pada lowongan \"{$job->title}\".",
                'in_app'
            );
        }
    }
}
