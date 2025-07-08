<?php

namespace Database\Factories;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Factories\Factory;

class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    public function definition(): array
    {
        $certificateTypes = [
            'Professional Relaxation Massage Therapy Certificate',
            'Massage Therapy Fundamentals Certificate',
            'Therapeutic Massage Completion Certificate',
            'Wellness Massage Practitioner Certificate',
            'Holistic Massage Therapy Certificate'
        ];

        $templates = [
            '<html><body style="text-align: center; font-family: serif; background: linear-gradient(45deg, #f0f8ff, #e6f3ff);">
                <div style="margin: 50px; padding: 40px; border: 3px solid #4a90e2;">
                    <h1 style="font-size: 48px; color: #2c3e50; margin-bottom: 30px;">Certificate of Completion</h1>
                    <h3 style="font-size: 24px; color: #34495e;">This certifies that</h3>
                    <h2 style="font-size: 36px; color: #e74c3c; margin: 20px 0;">{student_name}</h2>
                    <h3 style="font-size: 24px; color: #34495e;">has successfully completed</h3>
                    <h2 style="font-size: 32px; color: #2c3e50; margin: 20px 0;">{course_title}</h2>
                    <p style="font-size: 18px; margin: 30px 0;">Date: {completion_date}</p>
                    <p style="font-size: 16px;">Certificate Number: {certificate_number}</p>
                </div>
            </body></html>',
            
            '<html><body style="text-align: center; font-family: Georgia, serif; background: #fafafa;">
                <div style="margin: 40px; padding: 50px; border: 2px solid #8b4513; background: white;">
                    <h1 style="font-size: 42px; color: #8b4513; text-decoration: underline;">Certificate of Achievement</h1>
                    <p style="font-size: 20px; margin: 40px 0;">Awarded to</p>
                    <h2 style="font-size: 40px; color: #d2691e; font-style: italic;">{student_name}</h2>
                    <p style="font-size: 18px; margin: 30px 0;">For successful completion of</p>
                    <h3 style="font-size: 28px; color: #8b4513;">{course_title}</h3>
                    <div style="margin-top: 50px;">
                        <p>Completed: {completion_date}</p>
                        <p>Verification: {certificate_number}</p>
                    </div>
                </div>
            </body></html>'
        ];

        return [
            'title' => $this->faker->randomElement($certificateTypes),
            'template_content' => $this->faker->randomElement($templates),
            'background_image' => $this->faker->boolean(30) ? 'certificates/backgrounds/bg-' . $this->faker->numberBetween(1, 5) . '.jpg' : null,
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

    public function massageTherapy(): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => 'Professional Relaxation Massage Therapy Certificate',
            'template_content' => '<html><body style="text-align: center; font-family: serif; background: linear-gradient(45deg, #f0f8ff, #e6f3ff);">
                <div style="margin: 50px; padding: 40px; border: 3px solid #4a90e2;">
                    <h1 style="font-size: 48px; color: #2c3e50; margin-bottom: 30px;">Certificate of Completion</h1>
                    <h3 style="font-size: 24px; color: #34495e;">This certifies that</h3>
                    <h2 style="font-size: 36px; color: #e74c3c; margin: 20px 0;">{student_name}</h2>
                    <h3 style="font-size: 24px; color: #34495e;">has successfully completed the</h3>
                    <h2 style="font-size: 32px; color: #2c3e50; margin: 20px 0;">Professional Relaxation Massage Therapy Course</h2>
                    <p style="font-size: 18px; margin: 30px 0;">Demonstrating competency in massage techniques, client care, and professional practice</p>
                    <p style="font-size: 18px; margin: 30px 0;">Completed: {completion_date}</p>
                    <p style="font-size: 16px;">Certificate Number: {certificate_number}</p>
                    <p style="font-size: 16px;">Verification Code: {verification_code}</p>
                </div>
            </body></html>',
        ]);
    }
}