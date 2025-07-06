<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => $this->faker->randomElement(['student', 'instructor', 'admin']),
            'phone' => $this->faker->phoneNumber(),
            'bio' => $this->faker->paragraph(3),
            'avatar_url' => 'https://ui-avatars.com/api/?name=' . urlencode($this->faker->name()) . '&background=4F46E5&color=ffffff',
            'timezone' => $this->faker->timezone(),
            'language' => $this->faker->randomElement(['en', 'es', 'fr']),
            'date_of_birth' => $this->faker->dateTimeBetween('-70 years', '-18 years'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other', 'prefer_not_to_say']),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'profession' => $this->faker->randomElement(['Massage Therapist', 'Physical Therapist', 'Nurse', 'Chiropractor', 'Student', 'Fitness Trainer', 'Other']),
            'experience_level' => $this->faker->randomElement(['beginner', 'intermediate', 'professional']),
            'certifications' => json_encode($this->faker->randomElements(['CMT', 'LMT', 'NCTMB', 'AMTA', 'ABMP'], $this->faker->numberBetween(0, 3))),
            'specializations' => json_encode($this->faker->randomElements(['Swedish', 'Deep Tissue', 'Sports', 'Hot Stone', 'Aromatherapy', 'Prenatal'], $this->faker->numberBetween(0, 4))),
            'marketing_consent' => $this->faker->boolean(70),
            'newsletter_subscription' => $this->faker->boolean(60),
            'notification_preferences' => json_encode([
                'email_course_updates' => $this->faker->boolean(80),
                'email_new_courses' => $this->faker->boolean(60),
                'email_certificates' => $this->faker->boolean(95),
                'push_lesson_reminders' => $this->faker->boolean(70),
                'sms_important_updates' => $this->faker->boolean(40),
            ]),
            'last_login_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-2 years', '-1 month'),
            'updated_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Create an admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Create an instructor user.
     */
    public function instructor(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'instructor',
            'experience_level' => 'professional',
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Create a student user.
     */
    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'student',
        ]);
    }
}
