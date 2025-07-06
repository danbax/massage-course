<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Certificate;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::where('certification_available', true)->get();
        
        if ($courses->isEmpty()) {
            $this->command->error('No courses with certification available found.');
            return;
        }

        foreach ($courses as $course) {
            Certificate::factory()
                ->forCourse($course)
                ->active()
                ->create([
                    'name' => $course->title . ' - Certificate of Completion',
                    'description' => "Official certificate of completion for the {$course->title} course.",
                    'requirements' => json_encode([
                        'complete_all_lessons' => true,
                        'minimum_quiz_score' => $this->getMinimumScore($course->difficulty_level),
                        'practical_assessment' => $this->requiresPractical($course->category),
                        'attendance_percentage' => 90,
                        'final_exam_required' => $course->difficulty_level !== 'beginner',
                    ]),
                    'design_config' => json_encode([
                        'background_color' => '#ffffff',
                        'border_color' => $this->getBorderColor($course->difficulty_level),
                        'text_color' => '#1F2937',
                        'accent_color' => '#4F46E5',
                        'font_family' => 'serif',
                        'logo_position' => 'top-center',
                        'signature_required' => true,
                        'seal_required' => $course->difficulty_level === 'advanced',
                        'template_style' => $this->getTemplateStyle($course->category),
                    ]),
                ]);
        }

        $this->command->info("Created certificates for {$courses->count()} courses");
    }

    private function getMinimumScore(string $difficultyLevel): int
    {
        return match ($difficultyLevel) {
            'beginner' => 70,
            'intermediate' => 75,
            'advanced' => 80,
            default => 70,
        };
    }

    private function requiresPractical(string $category): bool
    {
        return in_array($category, ['deep-tissue', 'sports', 'therapeutic']);
    }

    private function getBorderColor(string $difficultyLevel): string
    {
        return match ($difficultyLevel) {
            'beginner' => '#10B981',    // Green
            'intermediate' => '#F59E0B', // Amber
            'advanced' => '#EF4444',     // Red
            default => '#4F46E5',        // Indigo
        };
    }

    private function getTemplateStyle(string $category): string
    {
        return match ($category) {
            'swedish' => 'classic',
            'deep-tissue' => 'professional',
            'sports' => 'modern',
            'therapeutic' => 'medical',
            'spa' => 'elegant',
            default => 'standard',
        };
    }
}
