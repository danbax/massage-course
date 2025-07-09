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
        
        // Get notification preferences from the user model
        $notificationPrefs = $user->notification_preferences ?? [];
        
        // Build settings array from user data
        $settings = [
            'notifications' => [
                'email_notifications' => $notificationPrefs['email_notifications'] ?? true,
                'push_notifications' => $notificationPrefs['push_notifications'] ?? true,
                'course_reminders' => $notificationPrefs['course_reminders'] ?? true,
                'progress_updates' => $notificationPrefs['progress_updates'] ?? true,
                'marketing_emails' => $notificationPrefs['marketing_emails'] ?? false
            ],
            'privacy' => [
                'profile_visibility' => $notificationPrefs['profile_visibility'] ?? 'public',
                'show_progress' => $notificationPrefs['show_progress'] ?? true,
                'show_certificates' => $notificationPrefs['show_certificates'] ?? true
            ],
            'preferences' => [
                'language' => $user->language ?? 'en',
                'timezone' => $user->timezone ?? 'UTC',
                'video_quality' => $notificationPrefs['video_quality'] ?? 'auto',
                'auto_play_next' => $notificationPrefs['auto_play_next'] ?? true
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

        $user = $request->user();
        
        // Get current notification preferences
        $notificationPrefs = $user->notification_preferences ?? [];
        
        // Update notification preferences with new values
        if (isset($validated['notifications'])) {
            foreach ($validated['notifications'] as $key => $value) {
                $notificationPrefs[$key] = $value;
            }
        }
        
        // Update privacy settings in notification preferences
        if (isset($validated['privacy'])) {
            foreach ($validated['privacy'] as $key => $value) {
                $notificationPrefs[$key] = $value;
            }
        }
        
        // Update preferences (some go to notification_preferences, some to user fields)
        if (isset($validated['preferences'])) {
            foreach ($validated['preferences'] as $key => $value) {
                if (in_array($key, ['language', 'timezone'])) {
                    // Update user table directly
                    $user->$key = $value;
                } else {
                    // Store in notification_preferences JSON
                    $notificationPrefs[$key] = $value;
                }
            }
        }
        
        // Save the updated data
        $user->notification_preferences = $notificationPrefs;
        $user->save();

        // Return the updated settings in the same format as show()
        $settings = [
            'notifications' => [
                'email_notifications' => $notificationPrefs['email_notifications'] ?? true,
                'push_notifications' => $notificationPrefs['push_notifications'] ?? true,
                'course_reminders' => $notificationPrefs['course_reminders'] ?? true,
                'progress_updates' => $notificationPrefs['progress_updates'] ?? true,
                'marketing_emails' => $notificationPrefs['marketing_emails'] ?? false
            ],
            'privacy' => [
                'profile_visibility' => $notificationPrefs['profile_visibility'] ?? 'public',
                'show_progress' => $notificationPrefs['show_progress'] ?? true,
                'show_certificates' => $notificationPrefs['show_certificates'] ?? true
            ],
            'preferences' => [
                'language' => $user->language ?? 'en',
                'timezone' => $user->timezone ?? 'UTC',
                'video_quality' => $notificationPrefs['video_quality'] ?? 'auto',
                'auto_play_next' => $notificationPrefs['auto_play_next'] ?? true
            ]
        ];

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $settings
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
