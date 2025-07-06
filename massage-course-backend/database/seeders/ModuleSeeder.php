<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();
        
        if ($courses->isEmpty()) {
            $this->command->error('No courses found. Please run CourseSeeder first.');
            return;
        }

        foreach ($courses as $course) {
            $moduleCount = fake()->numberBetween(3, 8);
            
            for ($i = 1; $i <= $moduleCount; $i++) {
                Module::factory()
                    ->forCourse($course)
                    ->published()
                    ->create([
                        'order' => $i,
                        'title' => $this->getModuleTitle($i, $moduleCount),
                        'description' => $this->getModuleDescription($i, $moduleCount, $course->category),
                    ]);
            }
        }

        $this->command->info('Created modules for all courses');
    }

    private function getModuleTitle(int $moduleNumber, int $totalModules): string
    {
        $titles = [
            1 => 'Introduction and Foundations',
            2 => 'Anatomy and Physiology',
            3 => 'Basic Techniques',
            4 => 'Intermediate Techniques',
            5 => 'Advanced Applications',
            6 => 'Safety and Ethics',
            7 => 'Professional Practice',
            8 => 'Assessment and Certification',
        ];

        if ($moduleNumber === 1) {
            return 'Introduction and Foundations';
        } elseif ($moduleNumber === $totalModules) {
            return 'Assessment and Certification';
        } elseif (isset($titles[$moduleNumber])) {
            return $titles[$moduleNumber];
        } else {
            return "Module {$moduleNumber}: Advanced Techniques";
        }
    }

    private function getModuleDescription(int $moduleNumber, int $totalModules, string $category): string
    {
        $descriptions = [
            1 => 'Introduction to massage therapy principles, history, and foundational concepts.',
            2 => 'Understanding human anatomy and physiology as it relates to massage therapy.',
            3 => 'Learning and practicing basic massage techniques and movements.',
            4 => 'Building on basic skills with intermediate techniques and applications.',
            5 => 'Advanced massage techniques for specific conditions and client needs.',
            6 => 'Professional ethics, safety protocols, and legal considerations.',
            7 => 'Business practices, client communication, and professional development.',
            8 => 'Final assessment, practical examinations, and certification requirements.',
        ];

        if (isset($descriptions[$moduleNumber])) {
            return $descriptions[$moduleNumber];
        }

        return "Advanced {$category} massage techniques and specialized applications.";
    }
}
