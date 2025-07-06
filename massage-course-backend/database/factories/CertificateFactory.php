<?php

namespace Database\Factories;

use App\Models\Certificate;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    public function definition(): array
    {
        $certificateTypes = [
            'Course Completion Certificate',
            'Professional Certification',
            'Continuing Education Certificate',
            'Specialty Training Certificate',
            'Advanced Practice Certificate'
        ];

        return [
            'course_id' => Course::factory(),
            'name' => $this->faker->randomElement($certificateTypes),
            'description' => 'Official certificate of completion for this massage therapy course.',
            'template_path' => 'certificates/templates/default-template.html',
            'requirements' => json_encode([
                'complete_all_lessons' => true,
                'minimum_quiz_score' => 70,
                'practical_assessment' => false,
                'attendance_percentage' => 80
            ]),
            'is_active' => $this->faker->boolean(85),
            'design_config' => json_encode([
                'background_color' => '#ffffff',
                'border_color' => '#4F46E5',
                'text_color' => '#1F2937',
                'font_family' => 'serif',
                'logo_position' => 'top-center',
                'signature_required' => true
            ]),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function forCourse(Course $course): static
    {
        return $this->state(fn (array $attributes) => [
            'course_id' => $course->id,
        ]);
    }
}
