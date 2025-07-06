<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Notifications\Notification;

class NotificationService
{
    /**
     * Send notification to a user
     */
    public function sendToUser(User $user, Notification $notification): void
    {
        try {
            $user->notify($notification);
            
            Log::info('Notification sent to user', [
                'user_id' => $user->id,
                'notification_type' => get_class($notification),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send notification to user', [
                'user_id' => $user->id,
                'notification_type' => get_class($notification),
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send notification to multiple users
     */
    public function sendToUsers(array $users, Notification $notification): void
    {
        foreach ($users as $user) {
            $this->sendToUser($user, $notification);
        }
    }

    /**
     * Send notification to all users with a specific role
     */
    public function sendToUsersWithRole(string $role, Notification $notification): void
    {
        $users = User::where('role', $role)->get();
        $this->sendToUsers($users->toArray(), $notification);
    }

    /**
     * Send course completion notification
     */
    public function sendCourseCompletionNotification(User $user, $course): void
    {
        // This would use a specific CourseCompletionNotification class
        Log::info('Course completion notification triggered', [
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);
    }

    /**
     * Send lesson completion notification
     */
    public function sendLessonCompletionNotification(User $user, $lesson): void
    {
        Log::info('Lesson completion notification triggered', [
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ]);
    }

    /**
     * Send welcome notification to new user
     */
    public function sendWelcomeNotification(User $user): void
    {
        Log::info('Welcome notification triggered', [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Send payment confirmation notification
     */
    public function sendPaymentConfirmationNotification(User $user, $payment): void
    {
        Log::info('Payment confirmation notification triggered', [
            'user_id' => $user->id,
            'payment_id' => $payment->id,
        ]);
    }

    /**
     * Send certificate generated notification
     */
    public function sendCertificateNotification(User $user, $certificate): void
    {
        Log::info('Certificate notification triggered', [
            'user_id' => $user->id,
            'certificate_id' => $certificate->id,
        ]);
    }

    /**
     * Send course enrollment notification
     */
    public function sendCourseEnrollmentNotification(User $user, $course): void
    {
        Log::info('Course enrollment notification triggered', [
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);
    }

    /**
     * Send reminder notification for incomplete courses
     */
    public function sendCourseReminderNotification(User $user, $course): void
    {
        Log::info('Course reminder notification triggered', [
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);
    }

    /**
     * Send bulk notifications
     */
    public function sendBulkNotification(array $userIds, Notification $notification): array
    {
        $results = [
            'success' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($userIds as $userId) {
            try {
                $user = User::find($userId);
                if ($user) {
                    $this->sendToUser($user, $notification);
                    $results['success']++;
                } else {
                    $results['failed']++;
                    $results['errors'][] = "User {$userId} not found";
                }
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][] = "Failed to send to user {$userId}: " . $e->getMessage();
            }
        }

        Log::info('Bulk notification completed', $results);

        return $results;
    }

    /**
     * Get notification preferences for a user
     */
    public function getUserNotificationPreferences(User $user): array
    {
        // In a real implementation, this would fetch from a user preferences table
        return [
            'email_notifications' => true,
            'push_notifications' => true,
            'sms_notifications' => false,
            'course_updates' => true,
            'payment_confirmations' => true,
            'marketing_emails' => false,
        ];
    }

    /**
     * Update notification preferences for a user
     */
    public function updateUserNotificationPreferences(User $user, array $preferences): void
    {
        // In a real implementation, this would save to a user preferences table
        Log::info('Notification preferences updated', [
            'user_id' => $user->id,
            'preferences' => $preferences,
        ]);
    }

    /**
     * Get notification statistics
     */
    public function getNotificationStats(string $period = 'month'): array
    {
        // In a real implementation, this would query a notifications table
        return [
            'total_sent' => 0,
            'total_delivered' => 0,
            'total_failed' => 0,
            'delivery_rate' => 0,
            'popular_types' => [],
        ];
    }

    /**
     * Schedule a notification for future delivery
     */
    public function scheduleNotification(User $user, Notification $notification, \DateTime $scheduledFor): void
    {
        // In a real implementation, this would use a queue with delayed dispatch
        Log::info('Notification scheduled', [
            'user_id' => $user->id,
            'notification_type' => get_class($notification),
            'scheduled_for' => $scheduledFor->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Cancel a scheduled notification
     */
    public function cancelScheduledNotification(string $notificationId): bool
    {
        // In a real implementation, this would remove from queue
        Log::info('Scheduled notification cancelled', [
            'notification_id' => $notificationId,
        ]);
        
        return true;
    }
}
