<?php

namespace App\Policies;

use App\Models\UserProgress;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserProgressPolicy
{
    /**
     * Determine whether the user can view any progress records.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can view the progress record.
     */
    public function view(User $user, UserProgress $userProgress): bool
    {
        return $user->id === $userProgress->user_id || 
               $user->role === 'admin' || 
               $user->role === 'instructor';
    }

    /**
     * Determine whether the user can create progress records.
     */
    public function create(User $user): bool
    {
        return true; // Users can create their own progress records
    }

    /**
     * Determine whether the user can update the progress record.
     */
    public function update(User $user, UserProgress $userProgress): bool
    {
        return $user->id === $userProgress->user_id || 
               $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the progress record.
     */
    public function delete(User $user, UserProgress $userProgress): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can reset their progress.
     */
    public function reset(User $user, UserProgress $userProgress): bool
    {
        return $user->id === $userProgress->user_id || 
               $user->role === 'admin';
    }

    /**
     * Determine whether the user can view detailed analytics.
     */
    public function viewAnalytics(User $user, UserProgress $userProgress): bool
    {
        return $user->id === $userProgress->user_id || 
               $user->role === 'admin' || 
               $user->role === 'instructor';
    }

    /**
     * Determine whether the user can export progress data.
     */
    public function export(User $user, UserProgress $userProgress): bool
    {
        return $user->id === $userProgress->user_id || 
               $user->role === 'admin' || 
               $user->role === 'instructor';
    }

    /**
     * Determine whether the user can modify completion status.
     */
    public function modifyCompletion(User $user, UserProgress $userProgress): bool
    {
        return $user->role === 'admin';
    }
}