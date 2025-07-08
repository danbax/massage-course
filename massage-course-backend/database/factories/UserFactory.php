<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'avatar' => null,
            'avatar_url' => 'https://ui-avatars.com/api/?name=' . urlencode($this->faker->name()) . '&background=4F46E5&color=ffffff',
            'phone' => $this->faker->phoneNumber(),
            'date_of_birth' => $this->faker->dateTimeBetween('-70 years', '-18 years'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other', 'prefer_not_to_say']),
            'profession' => $this->faker->randomElement(['Massage Therapist', 'Physical Therapist', 'Nurse', 'Chiropractor', 'Student', 'Fitness Trainer', 'Spa Therapist', 'Wellness Coach', 'Other']),
            'experience_level' => $this->faker->randomElement(['beginner', 'intermediate', 'professional']),
            'certifications' => json_encode($this->faker->randomElements(['CMT', 'LMT', 'NCTMB', 'AMTA', 'ABMP'], $this->faker->numberBetween(0, 3))),
            'specializations' => json_encode($this->faker->randomElements(['Swedish', 'Deep Tissue', 'Sports', 'Hot Stone', 'Aromatherapy', 'Prenatal', 'Thai Massage', 'Reflexology'], $this->faker->numberBetween(0, 4))),
            'bio' => $this->faker->paragraph(3),
            'marketing_consent' => $this->faker->boolean(70),
            'newsletter_subscription' => $this->faker->boolean(60),
            'notification_preferences' => json_encode([
                'email_course_updates' => $this->faker->boolean(80),
                'email_new_lessons' => $this->faker->boolean(60),
                'email_certificates' => $this->faker->boolean(95),
                'push_lesson_reminders' => $this->faker->boolean(70),
                'sms_important_updates' => $this->faker->boolean(40),
            ]),
            'is_admin' => $this->faker->boolean(5),
            'role' => $this->faker->randomElement(['student', 'instructor', 'admin']),
            'timezone' => $this->faker->timezone(),
            'language' => $this->faker->randomElement(['en', 'es', 'fr']),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'last_login_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-2 years', '-1 month'),
            'updated_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);
    }

    public function instructor(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'instructor',
            'experience_level' => 'professional',
            'email_verified_at' => now(),
        ]);
    }

    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'student',
        ]);
    }
}