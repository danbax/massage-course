<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $modules = Module::all();
        
        if ($modules->isEmpty()) {
            $this->command->error('No modules found. Please run ModuleSeeder first.');
            return;
        }

        foreach ($modules as $module) {
            $lessonCount = fake()->numberBetween(4, 10);
            
            for ($i = 1; $i <= $lessonCount; $i++) {
                Lesson::factory()
                    ->forModule($module)
                    ->published()
                    ->create([
                        'order' => $i,
                        'title' => $this->getLessonTitle($i, $module),
                        'is_free' => $i === 1, // First lesson is always free
                        'has_quiz' => $i % 3 === 0, // Every 3rd lesson has a quiz
                    ]);
            }
        }

        $this->command->info('Created lessons for all modules');
    }

    private function getLessonTitle(int $lessonNumber, Module $module): string
    {
        $lessonTitles = [
            'Introduction and Foundations' => [
                'Welcome to Massage Therapy',
                'History and Origins of Massage',
                'Benefits of Massage Therapy',
                'Professional Standards and Ethics',
                'Setting Up Your Practice Space',
                'Client Consultation Basics',
            ],
            'Anatomy and Physiology' => [
                'Musculoskeletal System Overview',
                'Understanding Muscle Groups',
                'Circulatory System and Massage',
                'Nervous System Basics',
                'Common Conditions and Contraindications',
                'Body Mechanics for Therapists',
            ],
            'Basic Techniques' => [
                'Hand Positions and Body Mechanics',
                'Effleurage Techniques',
                'Petrissage and Kneading',
                'Friction Techniques',
                'Tapotement and Percussion',
                'Vibration and Shaking',
            ],
            'Intermediate Techniques' => [
                'Deep Tissue Fundamentals',
                'Trigger Point Identification',
                'Joint Mobilization Basics',
                'Stretching Techniques',
                'Working with Different Body Types',
                'Pressure and Pacing',
            ],
            'Advanced Applications' => [
                'Specialized Techniques',
                'Working with Injuries',
                'Sports Massage Applications',
                'Pregnancy Massage Considerations',
                'Elderly Client Adaptations',
                'Complex Case Studies',
            ],
            'Safety and Ethics' => [
                'Professional Boundaries',
                'Hygiene and Sanitation',
                'Contraindications and Red Flags',
                'Emergency Procedures',
                'Legal and Insurance Considerations',
                'Continuing Education Requirements',
            ],
            'Professional Practice' => [
                'Business Setup and Licensing',
                'Marketing Your Practice',
                'Client Retention Strategies',
                'Record Keeping and Documentation',
                'Working with Healthcare Providers',
                'Professional Development',
            ],
            'Assessment and Certification' => [
                'Practical Skills Assessment',
                'Written Examination Preparation',
                'Case Study Presentations',
                'Certification Requirements',
                'Continuing Education Planning',
                'Career Development Pathways',
            ],
        ];

        // Find matching titles for this module
        foreach ($lessonTitles as $moduleTitle => $titles) {
            if (str_contains($module->title, $moduleTitle) || str_contains($moduleTitle, $module->title)) {
                if (isset($titles[$lessonNumber - 1])) {
                    return $titles[$lessonNumber - 1];
                }
            }
        }

        // Default lesson titles if no match found
        $defaultTitles = [
            'Introduction to Topic',
            'Basic Concepts and Principles',
            'Hands-on Practice Session',
            'Advanced Techniques',
            'Common Challenges and Solutions',
            'Real-world Applications',
            'Safety Considerations',
            'Professional Standards',
            'Case Studies and Examples',
            'Review and Assessment',
        ];

        return $defaultTitles[($lessonNumber - 1) % count($defaultTitles)] ?? "Lesson {$lessonNumber}";
    }
}
