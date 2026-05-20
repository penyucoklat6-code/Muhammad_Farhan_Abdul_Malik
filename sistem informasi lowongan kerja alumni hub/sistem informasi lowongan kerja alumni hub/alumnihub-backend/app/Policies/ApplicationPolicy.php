<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /**
     * Kaprodi atau pemilik lowongan yang bisa update status lamaran.
     */
    public function updateStatus(User $user, Application $application): bool
    {
        // Kaprodi bisa update semua lamaran
        if ($user->isKaprodi()) {
            return true;
        }

        // Pemilik lowongan bisa update lamaran pada lowongannya sendiri
        return $user->id === $application->job?->user_id;
    }

    /**
     * User hanya bisa melihat lamarannya sendiri, atau kaprodi bisa lihat semua.
     */
    public function view(User $user, Application $application): bool
    {
        return $user->id === $application->user_id || $user->isKaprodi();
    }
}
