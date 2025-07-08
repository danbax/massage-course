<?php

namespace App\Policies;

use App\Models\Module;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ModulePolicy
{
    /**
     * Determine whether the user can view any modules.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the module.
     */
    public function view(User $user, Module $module): bool
    {
        // Everyone has access to modules in single course system
        // But check if module is published for regular users
        if (!$module->is_published) {
            return $user->role === 'admin' || $user->role === 'instructor';
        }

        return true;
    }

    /**
     * Determine whether the user can create modules.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can update the module.
     */
    public function update(User $user, Module $module): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can delete the module.
     */
    public function delete(User $user, Module $module): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can restore the module.
     */
    public function restore(User $user, Module $module): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the module.
     */
    public function forceDelete(User $user, Module $module): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can access module content.
     */
    public function access(User $user, Module $module): bool
    {
        // Admin and instructors can access any module
        if ($user->role === 'admin' || $user->role === 'instructor') {
            return true;
        }

        // Check if module is published
        if (!$module->is_published) {
            return false;
        }

        // In single course system, all users have access to published modules
        return true;
    }

    /**
     * Determine whether the user can publish/unpublish the module.
     */
    public function publish(User $user, Module $module): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can reorder modules.
     */
    public function reorder(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can view module analytics.
     */
    public function viewAnalytics(User $user, Module $module): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }

    /**
     * Determine whether the user can duplicate the module.
     */
    public function duplicate(User $user, Module $module): bool
    {
        return $user->role === 'admin' || $user->role === 'instructor';
    }
}