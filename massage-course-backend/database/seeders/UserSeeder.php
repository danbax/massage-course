<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@massagecourse.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'phone' => '+1-555-0100',
            'bio' => 'Platform administrator with full system access.',
            'timezone' => 'America/New_York',
            'language' => 'en',
            'country' => 'United States',
            'city' => 'New York',
            'profession' => 'System Administrator',
            'experience_level' => 'professional',
            'marketing_consent' => true,
            'newsletter_subscription' => true,
            'notification_preferences' => json_encode([
                'email_course_updates' => true,
                'email_new_courses' => true,
                'email_certificates' => true,
                'push_lesson_reminders' => true,
                'sms_important_updates' => true,
            ]),
        ]);

        // Create instructor users
        User::factory()
            ->count(5)
            ->instructor()
            ->create();

        // Create student users
        User::factory()
            ->count(50)
            ->student()
            ->create();

        // Create some unverified users
        User::factory()
            ->count(10)
            ->student()
            ->unverified()
            ->create();

        $this->command->info('Created users: 1 admin, 5 instructors, 60 students');
    }
}
