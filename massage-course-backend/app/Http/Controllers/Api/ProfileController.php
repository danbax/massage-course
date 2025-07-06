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
            'profile' => new UserResource($user->load(['enrolledCourses', 'certificates']))
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
            'date_of_birth' => 'nullable|date|before:today'
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
        
        $enrolledCoursesCount = $user->courseEnrollments()->count();
        $completedCoursesCount = $user->courseEnrollments()->whereNotNull('completed_at')->count();
        $certificatesCount = $user->certificates()->count();
        $totalWatchTime = $user->lessonProgress()->sum('watch_time_seconds');

        return response()->json([
            'statistics' => [
                'enrolled_courses' => $enrolledCoursesCount,
                'completed_courses' => $completedCoursesCount,
                'certificates_earned' => $certificatesCount,
                'total_watch_time_hours' => round($totalWatchTime / 3600, 1),
                'completion_rate' => $enrolledCoursesCount > 0 ? 
                    round(($completedCoursesCount / $enrolledCoursesCount) * 100, 1) : 0
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
