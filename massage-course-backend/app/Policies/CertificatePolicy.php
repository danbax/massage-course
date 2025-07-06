<?php

namespace App\Policies;

use App\Models\Certificate;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CertificatePolicy
{
    /**
     * Determine whether the user can view any certificates.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view certificates
    }

    /**
     * Determine whether the user can view the certificate.
     */
    public function view(User $user, Certificate $certificate): bool
    {
        // Users can view their own certificates, admins can view all
        return $user->id === $certificate->user_id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can create certificates.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin'; // Only admins can manually create certificates
    }

    /**
     * Determine whether the user can update the certificate.
     */
    public function update(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the certificate.
     */
    public function delete(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the certificate.
     */
    public function restore(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the certificate.
     */
    public function forceDelete(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can download the certificate.
     */
    public function download(User $user, Certificate $certificate): bool
    {
        // Users can download their own certificates, admins can download all
        return $user->id === $certificate->user_id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can verify the certificate.
     */
    public function verify(User $user, Certificate $certificate): bool
    {
        return true; // Anyone can verify a certificate
    }

    /**
     * Determine whether the user can regenerate the certificate.
     */
    public function regenerate(User $user, Certificate $certificate): bool
    {
        return $user->role === 'admin' || 
               ($user->id === $certificate->user_id && $certificate->can_regenerate);
    }

    /**
     * Determine whether the user can share the certificate.
     */
    public function share(User $user, Certificate $certificate): bool
    {
        // Users can share their own certificates
        return $user->id === $certificate->user_id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can view certificate analytics.
     */
    public function viewAnalytics(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can bulk generate certificates.
     */
    public function bulkGenerate(User $user): bool
    {
        return $user->role === 'admin';
    }
}
