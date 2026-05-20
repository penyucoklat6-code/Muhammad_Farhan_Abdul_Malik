<?php

namespace App\Policies;

use App\Models\Job;
use App\Models\User;

class JobPolicy
{
    /**
     * Hanya owner yang bisa update lowongan.
     */
    public function update(User $user, Job $job): bool
    {
        return $user->id === $job->user_id;
    }

    /**
     * Owner atau Kaprodi yang bisa delete (soft delete) lowongan.
     */
    public function delete(User $user, Job $job): bool
    {
        return $user->id === $job->user_id || $user->isKaprodi();
    }

    /**
     * Hanya Kaprodi yang bisa mereview lowongan.
     */
    public function review(User $user, Job $job): bool
    {
        return $user->isKaprodi();
    }

    /**
     * Hanya Kaprodi yang bisa restore dari recycle bin.
     */
    public function restore(User $user, Job $job): bool
    {
        return $user->isKaprodi();
    }

    /**
     * Hanya Kaprodi yang bisa hapus permanen.
     */
    public function forceDelete(User $user, Job $job): bool
    {
        return $user->isKaprodi();
    }
}
