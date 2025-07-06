<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        // Get instructors
        $instructors = User::where('role', 'instructor')->get();
        
        if ($instructors->isEmpty()) {
            $this->command->error('No instructors found. Please run UserSeeder first.');
            return;
        }

        // Create featured courses
        $featuredCourses = [
            [
                'title' => 'Complete Swedish Massage Certification',
                'description' => 'Master the art of Swedish massage with this comprehensive certification course. Learn all fundamental techniques including effleurage, petrissage, friction, tapotement, and vibration.',
                'short_description' => 'Complete certification in Swedish massage techniques and theory.',
                'price' => 199.99,
                'duration_hours' => 24,
                'difficulty_level' => 'beginner',
                'category' => 'swedish',
                'featured' => true,
                'is_published' => true,
                'certification_available' => true,
                'learning_objectives' => json_encode([
                    'Master all 5 Swedish massage techniques',
                    'Understand anatomy and physiology basics',
                    'Apply proper body mechanics',
                    'Ensure client safety and comfort',
                    'Complete practical assessments'
                ]),
                'requirements' => json_encode([
                    'No prior massage experience required',
                    'Access to massage table for practice',
                    'Completion of all modules required for certification'
                ]),
                'tags' => json_encode(['swedish', 'massage', 'certification', 'beginner', 'relaxation']),
            ],
            [
                'title' => 'Deep Tissue Massage Mastery',
                'description' => 'Advanced course focusing on deep tissue massage techniques for chronic pain relief and muscle tension. Learn to work with specific muscle groups and trigger points.',
                'short_description' => 'Advanced deep tissue massage techniques for therapeutic applications.',
                'price' => 249.99,
                'duration_hours' => 18,
                'difficulty_level' => 'intermediate',
                'category' => 'deep-tissue',
                'featured' => true,
                'is_published' => true,
                'certification_available' => true,
                'learning_objectives' => json_encode([
                    'Apply deep tissue massage techniques safely',
                    'Identify and treat trigger points',
                    'Work with chronic pain conditions',
                    'Understand contraindications',
                    'Develop treatment plans'
                ]),
                'requirements' => json_encode([
                    'Basic massage training required',
                    'Understanding of anatomy helpful',
                    'Physical fitness for demanding techniques'
                ]),
                'tags' => json_encode(['deep-tissue', 'massage', 'therapeutic', 'pain-relief', 'advanced']),
            ],
            [
                'title' => 'Sports Massage for Athletes',
                'description' => 'Specialized massage techniques for athletic performance enhancement and injury prevention. Learn pre-event, post-event, and maintenance massage protocols.',
                'short_description' => 'Sports massage techniques for athletic performance and recovery.',
                'price' => 179.99,
                'duration_hours' => 15,
                'difficulty_level' => 'intermediate',
                'category' => 'sports',
                'featured' => true,
                'is_published' => true,
                'certification_available' => true,
                'learning_objectives' => json_encode([
                    'Apply sports massage techniques',
                    'Understand athletic performance needs',
                    'Implement injury prevention protocols',
                    'Provide pre and post-event treatments',
                    'Work with sports teams'
                ]),
                'requirements' => json_encode([
                    'Basic massage certification required',
                    'Understanding of sports and athletics',
                    'Physical fitness for intensive work'
                ]),
                'tags' => json_encode(['sports', 'massage', 'athletes', 'performance', 'recovery']),
            ],
        ];

        foreach ($featuredCourses as $courseData) {
            $courseData['instructor_id'] = $instructors->random()->id;
            $courseData['thumbnail_url'] = 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=' . urlencode($courseData['title']);
            $courseData['preview_video_url'] = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
            $courseData['rating_average'] = fake()->randomFloat(1, 4.0, 5.0);
            $courseData['rating_count'] = fake()->numberBetween(50, 200);
            $courseData['enrollment_count'] = fake()->numberBetween(100, 500);
            
            Course::create($courseData);
        }

        // Create additional courses using factory
        Course::factory()
            ->count(12)
            ->published()
            ->create([
                'instructor_id' => fn() => $instructors->random()->id
            ]);

        // Create some unpublished courses
        Course::factory()
            ->count(3)
            ->create([
                'instructor_id' => fn() => $instructors->random()->id,
                'is_published' => false
            ]);

        $this->command->info('Created 18 courses: 3 featured courses + 12 published + 3 unpublished');
    }
}
