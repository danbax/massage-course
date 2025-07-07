<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $modules = Module::orderBy('order')->get();
        
        if ($modules->isEmpty()) {
            $this->command->error('No modules found. Please run ModuleSeeder first.');
            return;
        }

        $lessonData = [
            "Let's Get This Party Started" => [
                [
                    'title' => 'Hey, Welcome to the Course!',
                    'description' => 'Get excited about your massage journey! Learn what makes you awesome at this and discover why this course will transform your skills.',
                    'duration_minutes' => 15,
                    'video_url' => '/videos/1.1.mp4',
                    'is_free' => true,
                ],
                [
                    'title' => 'What Makes You Awesome at This?',
                    'description' => 'Discover the qualities that make a great massage therapist beyond just technique - caring, professionalism, and continuous learning.',
                    'duration_minutes' => 12,
                    'video_url' => '/videos/1.2.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'How This Course Works',
                    'description' => 'Your roadmap to massage mastery - from body basics to building your business, no boring stuff included!',
                    'duration_minutes' => 18,
                    'video_url' => '/videos/1.3.mp4',
                    'is_free' => false,
                ],
            ],
            'Body Basics for Beginners' => [
                [
                    'title' => 'Anatomy for Massage Therapists',
                    'description' => 'Understanding the human body structure essential for effective massage therapy.',
                    'duration_minutes' => 25,
                    'video_url' => '/videos/2.1.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Muscle Groups and Their Functions',
                    'description' => 'Deep dive into major muscle groups and how they work together.',
                    'duration_minutes' => 20,
                    'video_url' => '/videos/2.2.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Body Mechanics and Posture',
                    'description' => 'Protecting yourself while providing effective treatment.',
                    'duration_minutes' => 15,
                    'video_url' => '/videos/2.3.mp4',
                    'is_free' => false,
                ],
            ],
            'Relaxation Massage Fundamentals' => [
                [
                    'title' => 'Swedish Massage Basics',
                    'description' => 'Master the foundational techniques of Swedish massage.',
                    'duration_minutes' => 30,
                    'video_url' => '/videos/3.1.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Pressure and Rhythm',
                    'description' => 'Finding the right pressure and rhythm for relaxation.',
                    'duration_minutes' => 22,
                    'video_url' => '/videos/3.2.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Full Body Integration',
                    'description' => 'Connecting different techniques for a cohesive session.',
                    'duration_minutes' => 28,
                    'video_url' => '/videos/3.3.mp4',
                    'is_free' => false,
                ],
            ],
            'Deep Tissue Mastery' => [
                [
                    'title' => 'Deep Tissue Principles',
                    'description' => 'Understanding the science behind deep tissue massage.',
                    'duration_minutes' => 35,
                    'video_url' => '/videos/4.1.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Advanced Pressure Techniques',
                    'description' => 'Applying therapeutic pressure safely and effectively.',
                    'duration_minutes' => 40,
                    'video_url' => '/videos/4.2.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Trigger Point Therapy',
                    'description' => 'Identifying and treating trigger points.',
                    'duration_minutes' => 45,
                    'video_url' => '/videos/4.3.mp4',
                    'is_free' => false,
                ],
            ],
            'Sports & Performance Massage' => [
                [
                    'title' => 'Pre-Event Massage',
                    'description' => 'Preparing athletes for optimal performance.',
                    'duration_minutes' => 25,
                    'video_url' => '/videos/5.1.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Post-Event Recovery',
                    'description' => 'Techniques for recovery and injury prevention.',
                    'duration_minutes' => 30,
                    'video_url' => '/videos/5.2.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Injury Assessment and Treatment',
                    'description' => 'Working with common sports injuries.',
                    'duration_minutes' => 20,
                    'video_url' => '/videos/5.3.mp4',
                    'is_free' => false,
                ],
            ],
            'Business Building Brilliance' => [
                [
                    'title' => 'Setting Up Your Practice',
                    'description' => 'Everything you need to start your massage business.',
                    'duration_minutes' => 20,
                    'video_url' => '/videos/6.1.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Marketing and Client Acquisition',
                    'description' => 'Building a steady client base.',
                    'duration_minutes' => 18,
                    'video_url' => '/videos/6.2.mp4',
                    'is_free' => false,
                ],
                [
                    'title' => 'Business Growth Strategies',
                    'description' => 'Scaling your practice for long-term success.',
                    'duration_minutes' => 12,
                    'video_url' => '/videos/6.3.mp4',
                    'is_free' => false,
                ],
            ],
        ];

        foreach ($modules as $module) {
            if (isset($lessonData[$module->title])) {
                $lessons = $lessonData[$module->title];
                
                foreach ($lessons as $index => $lessonInfo) {
                    Lesson::create([
                        'module_id' => $module->id,
                        'title' => $lessonInfo['title'],
                        'description' => $lessonInfo['description'],
                        'content' => $lessonInfo['description'], // Using description as content for now
                        'video_url' => $lessonInfo['video_url'],
                        'duration_minutes' => $lessonInfo['duration_minutes'],
                        'order' => $index + 1,
                        'is_published' => true,
                        'is_free' => $lessonInfo['is_free'],
                        'has_quiz' => false, // Can be updated later
                    ]);
                }
            }
        }

        $this->command->info('Created lessons for all modules in single course system');
    }
}
