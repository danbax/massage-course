<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Generate certificates daily at 2:00 AM
        $schedule->command('certificates:generate')
                 ->dailyAt('02:00')
                 ->withoutOverlapping()
                 ->runInBackground();

        // Update course statistics daily at 3:00 AM
        $schedule->command('stats:update-courses')
                 ->dailyAt('03:00')
                 ->withoutOverlapping()
                 ->runInBackground();

        // Clean up expired tokens weekly on Sunday at 4:00 AM
        $schedule->command('tokens:cleanup')
                 ->weeklyOn(0, '04:00')
                 ->withoutOverlapping()
                 ->runInBackground();

        // Clean up old tokens more aggressively monthly
        $schedule->command('tokens:cleanup --days=7')
                 ->monthlyOn(1, '04:30')
                 ->withoutOverlapping()
                 ->runInBackground();

        // Update course statistics every 6 hours for active courses
        $schedule->command('stats:update-courses')
                 ->everySixHours()
                 ->withoutOverlapping()
                 ->runInBackground()
                 ->when(function () {
                     // Only run if there are recent course activities
                     return \App\Models\CourseEnrollment::where('created_at', '>=', now()->subHours(6))->exists();
                 });

        // Send course reminder notifications weekly
        $schedule->call(function () {
            // Send reminders to users who haven't accessed their courses in a week
            $this->sendCourseReminders();
        })->weekly()->sundays()->at('10:00');

        // Backup database daily at 1:00 AM
        $schedule->command('backup:run --only-db')
                 ->dailyAt('01:00')
                 ->withoutOverlapping()
                 ->runInBackground()
                 ->when(function () {
                     // Only run if backup package is installed
                     return class_exists('\Spatie\Backup\Commands\BackupCommand');
                 });
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }

    /**
     * Send course reminder notifications
     */
    private function sendCourseReminders(): void
    {
        try {
            $inactiveUsers = \App\Models\CourseEnrollment::with(['user', 'course'])
                ->where('last_accessed_at', '<', now()->subDays(7))
                ->orWhereNull('last_accessed_at')
                ->get();

            $notificationService = app(\App\Services\NotificationService::class);

            foreach ($inactiveUsers as $enrollment) {
                $notificationService->sendCourseReminderNotification(
                    $enrollment->user,
                    $enrollment->course
                );
            }

            \Illuminate\Support\Facades\Log::info('Course reminders sent', [
                'count' => $inactiveUsers->count()
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send course reminders', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
