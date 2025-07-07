<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        $titles = [
            'Swedish Massage Fundamentals',
            'Deep Tissue Massage Techniques', 
            'Hot Stone Massage Therapy',
            'Aromatherapy Massage Methods',
            'Sports Massage for Athletes',
            'Prenatal Massage Safety',
            'Thai Massage Basics',
            'Reflexology Techniques',
            'Trigger Point Therapy',
            'Chair Massage for Workplace Wellness'
        ];

        $descriptions = [
            'Learn the fundamental techniques of Swedish massage including effleurage, petrissage, and friction movements.',
            'Master deep tissue massage techniques to help clients with chronic muscle tension and pain.',
            'Discover the therapeutic benefits of hot stone massage and proper stone placement techniques.',
            'Explore aromatherapy principles and essential oil applications in massage therapy.',
            'Specialized massage techniques for athletes including pre-event and post-event protocols.',
            'Safe and effective prenatal massage techniques for expecting mothers.',
            'Traditional Thai massage stretching and pressure point techniques.',
            'Foot reflexology mapping and therapeutic pressure techniques.',
            'Identify and treat trigger points for pain relief and muscle function.',
            'Effective chair massage techniques for corporate and workplace settings.'
        ];

        $title = $this->faker->randomElement($titles);
        $description = $this->faker->randomElement($descriptions);

        return [
            'title' => $title,
            'description' => $description,
            'short_description' => $this->faker->sentence(15),
            'instructor_id' => User::factory(),
            'price' => $this->faker->randomFloat(2, 29.99, 299.99),
            'currency' => 'USD',
            'duration_hours' => $this->faker->numberBetween(2, 40),
            'difficulty_level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'language' => $this->faker->randomElement(['en', 'es', 'fr']),
            'category' => $this->faker->randomElement(['swedish', 'deep-tissue', 'sports', 'therapeutic', 'spa']),
            'is_published' => $this->faker->boolean(80), // 80% chance of being published
            'featured' => $this->faker->boolean(20), // 20% chance of being featured
            'thumbnail_url' => 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=' . urlencode($title),
            'preview_video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'learning_objectives' => json_encode([
                'Understand basic massage principles',
                'Apply proper body mechanics',
                'Demonstrate professional techniques',
                'Ensure client safety and comfort'
            ]),
            'requirements' => json_encode([
                'No prior experience required',
                'Massage table access recommended',
                'Comfortable clothing for practical sessions'
            ]),
            'tags' => json_encode($this->faker->randomElements(['massage', 'therapy', 'wellness', 'health', 'relaxation', 'bodywork'], 3)),
            'estimated_completion_time' => $this->faker->numberBetween(1, 8) . ' weeks',
            'certification_available' => $this->faker->boolean(70),
            'rating_average' => $this->faker->randomFloat(1, 3.5, 5.0),
            'rating_count' => $this->faker->numberBetween(0, 500),
            'enrollment_count' => $this->faker->numberBetween(0, 1000),
            'last_updated' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-2 years', '-1 month'),
            'updated_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured' => true,
            'is_published' => true,
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    public function beginner(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty_level' => 'beginner',
            'price' => $this->faker->randomFloat(2, 29.99, 99.99),
        ]);
    }

    public function advanced(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty_level' => 'advanced',
            'price' => $this->faker->randomFloat(2, 149.99, 299.99),
        ]);
    }
}
