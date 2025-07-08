<?php

namespace App\Policies;

use App\Models\Certificate;
use App\Models\UserCertificate;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CertificatePolicy
{
    /**
     * Determine whether the user can view any certificates.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the certificate template.
     */
    public function view(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can create certificate templates.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the certificate template.
     */
    public function update(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the certificate template.
     */
    public function delete(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the certificate template.
     */
    public function restore(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the certificate template.
     */
    public function forceDelete(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view certificate analytics.
     */
    public function viewAnalytics(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can bulk generate certificates.
     */
    public function bulkGenerate(User $user): bool
    {
        return $user->role === 'admin';
    }
}

class UserCertificatePolicy
{
    /**
     * Determine whether the user can view any user certificates.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the user certificate.
     */
    public function view(User $user, UserCertificate $userCertificate): bool
    {
        return $user->id === $userCertificate->user_id || 
               $user->role === 'admin' || 
               $user->role === 'instructor';
    }

    /**
     * Determine whether the user can download the certificate.
     */
    public function download(User $user, UserCertificate $userCertificate): bool
    {
        return $user->id === $userCertificate->user_id || 
               $user->role === 'admin' || 
               $user->role === 'instructor';
    }

    /**
     * Determine whether the user can verify the certificate.
     */
    public function verify(?User $user, UserCertificate $userCertificate): bool
    {
        return true; // Anyone can verify a certificate (even guests)
    }

    /**
     * Determine whether the user can regenerate the certificate.
     */
    public function regenerate(User $user, UserCertificate $userCertificate): bool
    {
        return $user->role === 'admin' || 
               ($user->id === $userCertificate->user_id && $user->hasCompletedCourse());
    }

    /**
     * Determine whether the user can share the certificate.
     */
    public function share(User $user, UserCertificate $userCertificate): bool
    {
        return $user->id === $userCertificate->user_id || 
               $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the certificate.
     */
    public function delete(User $user, UserCertificate $userCertificate): bool
    {
        return $user->role === 'admin';
    }
}