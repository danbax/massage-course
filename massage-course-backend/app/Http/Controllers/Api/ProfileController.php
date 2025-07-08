<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Show user profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'profile' => new UserResource($user->load(['certificates', 'progress']))
        ]);
    }

    /**
     * Update user profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'profession' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other,prefer_not_to_say',
            'experience_level' => 'nullable|in:beginner,intermediate,professional',
            'certifications' => 'nullable|array',
            'specializations' => 'nullable|array',
            'language' => 'nullable|in:en,es,fr,ru',
            'timezone' => 'nullable|string',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'marketing_consent' => 'nullable|boolean',
            'newsletter_subscription' => 'nullable|boolean',
            'notification_preferences' => 'nullable|array'
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => new UserResource($user)
        ]);
    }

    /**
     * Update user avatar.
     */
    public function updateAvatar(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Delete old avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
        }

        // Store new avatar
        $avatarName = time() . '_' . $user->id . '.' . $request->avatar->extension();
        $request->avatar->storeAs('avatars', $avatarName, 'public');

        $user->update(['avatar' => $avatarName]);

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar_url' => $user->avatar_url
        ]);
    }

    /**
     * Delete user avatar.
     */
    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
            $user->update(['avatar' => null]);
        }

        return response()->json([
            'message' => 'Avatar deleted successfully'
        ]);
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
                'errors' => [
                    'current_password' => ['The provided password does not match our records.']
                ]
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }

    /**
     * Get user statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();
        $userLanguage = $user->language ?? 'en';
        
        $progress = $user->progress;
        $completedLessonsCount = $user->lessonProgress()->where('is_completed', true)->count();
        $totalLessons = \App\Models\Lesson::where('language', $userLanguage)
            ->where('is_published', true)
            ->count();
        $certificatesCount = $user->certificates()->count();
        $totalWatchTime = $user->lessonProgress()->sum('watch_time_seconds');

        return response()->json([
            'statistics' => [
                'course_progress' => $progress ? $progress->progress_percentage : 0,
                'completed_lessons' => $completedLessonsCount,
                'total_lessons' => $totalLessons,
                'certificates_earned' => $certificatesCount,
                'total_watch_time_hours' => round($totalWatchTime / 3600, 1),
                'time_spent_minutes' => $progress ? $progress->time_spent_minutes : 0,
                'is_course_completed' => $user->hasCompletedCourse(),
                'started_at' => $progress ? $progress->started_at : null,
                'completed_at' => $progress ? $progress->completed_at : null
            ]
        ]);
    }

    /**
     * Delete user account.
     */
    public function deleteAccount(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $request->validate([
            'password' => 'required'
        ]);

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Password is incorrect',
                'errors' => [
                    'password' => ['The provided password does not match our records.']
                ]
            ], 422);
        }

        // Delete user avatar
        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
        }

        // Revoke all tokens
        $user->tokens()->delete();

        // Delete user account
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}