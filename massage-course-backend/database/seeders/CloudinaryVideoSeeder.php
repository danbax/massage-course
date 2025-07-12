<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lesson;
use Illuminate\Support\Facades\DB;

class CloudinaryVideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample Cloudinary video public IDs for testing
        // These are example public IDs - replace with actual ones from your Cloudinary account
        $sampleVideos = [
            'massage-course/lessons/lets-get-this-party-started/hey-welcome-to-the-course-1',
            'massage-course/lessons/lets-get-this-party-started/what-makes-you-awesome-at-this-2',
            'massage-course/lessons/lets-get-this-party-started/how-this-course-works-3',
            'massage-course/lessons/the-stuff-that-really-really-matters/why-this-chapter-will-save-your-career-4',
            'massage-course/lessons/the-stuff-that-really-really-matters/choosing-your-massage-table-5',
            'massage-course/lessons/the-stuff-that-really-really-matters/the-great-oil-vs-cream-debate-6',
            'massage-course/lessons/the-stuff-that-really-really-matters/setting-up-your-table-7',
            'massage-course/lessons/the-stuff-that-really-really-matters/little-things-that-make-you-a-wizard-8',
            'massage-course/lessons/the-stuff-that-really-really-matters/time-management-9',
            'massage-course/lessons/the-stuff-that-really-really-matters/the-nope-list-10',
            'massage-course/lessons/the-stuff-that-really-really-matters/making-clients-comfortable-11',
            'massage-course/lessons/the-stuff-that-really-really-matters/practice-makes-perfect-12',
            'massage-course/lessons/the-stuff-that-really-really-matters/save-your-body-save-your-career-13',
        ];

        // Update the first few lessons with sample Cloudinary public IDs
        $lessons = Lesson::orderBy('id')->limit(count($sampleVideos))->get();

        foreach ($lessons as $index => $lesson) {
            if (isset($sampleVideos[$index])) {
                $lesson->update([
                    'video_url' => $sampleVideos[$index],
                    'video_duration' => rand(300, 1800), // Random duration between 5-30 minutes
                ]);

                $this->command->info("Updated lesson {$lesson->id}: {$lesson->title} with Cloudinary URL: {$sampleVideos[$index]}");
            }
        }

        $this->command->info('Cloudinary video URLs seeded successfully!');
        $this->command->info('Updated ' . count($lessons) . ' lessons with sample Cloudinary public IDs.');
    }
}
