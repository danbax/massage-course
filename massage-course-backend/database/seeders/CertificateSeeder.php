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
                    'title' => $course->title . ' - Certificate of Completion',
                    'template_content' => '<html><body><h1>Certificate of Completion</h1><p>This certifies that {student_name} has successfully completed {course_title}</p></body></html>',
                    'background_image' => null,
                ]);
        }

        $this->command->info("Created certificates for {$courses->count()} courses");
    }
}
