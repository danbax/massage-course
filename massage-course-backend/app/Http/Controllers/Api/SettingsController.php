<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Show user settings.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Get user settings (you might want to create a UserSettings model)
        $settings = [
            'notifications' => [
                'email_notifications' => true,
                'push_notifications' => true,
                'course_reminders' => true,
                'progress_updates' => true,
                'marketing_emails' => false
            ],
            'privacy' => [
                'profile_visibility' => 'public',
                'show_progress' => true,
                'show_certificates' => true
            ],
            'preferences' => [
                'language' => 'en',
                'timezone' => 'UTC',
                'video_quality' => 'auto',
                'auto_play_next' => true
            ]
        ];

        return response()->json([
            'settings' => $settings
        ]);
    }

    /**
     * Update user settings.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'notifications.email_notifications' => 'sometimes|boolean',
            'notifications.push_notifications' => 'sometimes|boolean',
            'notifications.course_reminders' => 'sometimes|boolean',
            'notifications.progress_updates' => 'sometimes|boolean',
            'notifications.marketing_emails' => 'sometimes|boolean',
            'privacy.profile_visibility' => 'sometimes|in:public,private',
            'privacy.show_progress' => 'sometimes|boolean',
            'privacy.show_certificates' => 'sometimes|boolean',
            'preferences.language' => 'sometimes|in:en,es,fr,de',
            'preferences.timezone' => 'sometimes|string',
            'preferences.video_quality' => 'sometimes|in:auto,720p,1080p',
            'preferences.auto_play_next' => 'sometimes|boolean'
        ]);

        // Here you would update the user settings
        // For now, we'll just return success

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $validated
        ]);
    }

    /**
     * Get notification settings.
     */
    public function notifications(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $notifications = [
            'email_notifications' => true,
            'push_notifications' => true,
            'course_reminders' => true,
            'progress_updates' => true,
            'marketing_emails' => false,
            'lesson_reminders' => true,
            'certificate_notifications' => true
        ];

        return response()->json([
            'notifications' => $notifications
        ]);
    }

    /**
     * Update notification settings.
     */
    public function updateNotifications(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email_notifications' => 'sometimes|boolean',
            'push_notifications' => 'sometimes|boolean',
            'course_reminders' => 'sometimes|boolean',
            'progress_updates' => 'sometimes|boolean',
            'marketing_emails' => 'sometimes|boolean',
            'lesson_reminders' => 'sometimes|boolean',
            'certificate_notifications' => 'sometimes|boolean'
        ]);

        // Here you would update the notification preferences
        // For now, we'll just return success

        return response()->json([
            'message' => 'Notification settings updated successfully',
            'notifications' => $validated
        ]);
    }

    /**
     * Export user data.
     */
    public function exportData(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $data = [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at
            ],
            'courses' => $user->enrolledCourses()->get(['title', 'enrolled_at']),
            'progress' => $user->courseProgress()->get(),
            'certificates' => $user->certificates()->get(['certificate_number', 'issued_at'])
        ];

        return response()->json([
            'message' => 'Data export prepared',
            'data' => $data
        ]);
    }

    /**
     * Get privacy settings.
     */
    public function privacy(Request $request): JsonResponse
    {
        $privacy = [
            'profile_visibility' => 'public',
            'show_progress' => true,
            'show_certificates' => true,
            'allow_contact' => true,
            'data_processing_consent' => true
        ];

        return response()->json([
            'privacy' => $privacy
        ]);
    }

    /**
     * Update privacy settings.
     */
    public function updatePrivacy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'profile_visibility' => 'sometimes|in:public,private',
            'show_progress' => 'sometimes|boolean',
            'show_certificates' => 'sometimes|boolean',
            'allow_contact' => 'sometimes|boolean',
            'data_processing_consent' => 'sometimes|boolean'
        ]);

        return response()->json([
            'message' => 'Privacy settings updated successfully',
            'privacy' => $validated
        ]);
    }
}
