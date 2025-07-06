<?php

namespace Database\Factories;

use App\Models\Module;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class ModuleFactory extends Factory
{
    protected $model = Module::class;

    public function definition(): array
    {
        $moduleTitles = [
            'Introduction and Foundations',
            'Basic Techniques and Theory',
            'Anatomy and Physiology',
            'Practical Application',
            'Advanced Methods',
            'Safety and Ethics',
            'Business Practices',
            'Specialized Techniques',
            'Assessment and Treatment',
            'Professional Development'
        ];

        $descriptions = [
            'Foundation concepts and introduction to massage therapy principles.',
            'Learn basic massage strokes and their therapeutic applications.',
            'Understanding human anatomy as it relates to massage therapy.',
            'Hands-on practice and technique refinement.',
            'Advanced massage techniques for experienced practitioners.',
            'Professional ethics, safety protocols, and client care.',
            'Business aspects of massage therapy practice.',
            'Specialized techniques for specific conditions.',
            'Client assessment and treatment planning.',
            'Continuing education and professional growth.'
        ];

        return [
            'course_id' => Course::factory(),
            'title' => $this->faker->randomElement($moduleTitles),
            'description' => $this->faker->randomElement($descriptions),
            'duration_minutes' => $this->faker->numberBetween(30, 180),
            'learning_objectives' => json_encode([
                'Understand key concepts',
                'Apply practical techniques',
                'Demonstrate proficiency'
            ]),
            'order' => $this->faker->numberBetween(1, 10),
            'is_published' => $this->faker->boolean(85),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
        ]);
    }

    public function forCourse(Course $course): static
    {
        return $this->state(fn (array $attributes) => [
            'course_id' => $course->id,
        ]);
    }
}
