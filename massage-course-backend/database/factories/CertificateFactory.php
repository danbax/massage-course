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
            'title' => $this->faker->randomElement($certificateTypes),
            'template_content' => '<html><body><h1>Certificate of Completion</h1><p>This certifies that {student_name} has successfully completed {course_title}</p></body></html>',
            'background_image' => null,
            'is_active' => $this->faker->boolean(85),
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
