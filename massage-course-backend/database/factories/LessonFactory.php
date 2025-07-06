<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition(): array
    {
        $lessonTitles = [
            'Introduction to Massage Therapy',
            'Basic Hand Positions and Movements',
            'Understanding Client Needs',
            'Effleurage Techniques',
            'Petrissage and Kneading',
            'Friction and Compression',
            'Tapotement and Vibration',
            'Joint Mobilization',
            'Trigger Point Location',
            'Pressure Point Therapy',
            'Body Mechanics for Therapists',
            'Draping and Positioning',
            'Assessment Techniques',
            'Treatment Planning',
            'Professional Boundaries',
            'Contraindications and Safety',
            'Hygiene and Sanitation',
            'Equipment and Supplies',
            'Documentation and Records',
            'Business Communication'
        ];

        $descriptions = [
            'Learn the fundamental principles and history of massage therapy.',
            'Master proper hand positioning and basic massage movements.',
            'Develop skills to assess and understand client requirements.',
            'Practice long, gliding strokes for relaxation and circulation.',
            'Learn kneading techniques for muscle tension relief.',
            'Apply friction and compression for deep tissue work.',
            'Explore rhythmic tapping and vibration techniques.',
            'Understand joint movement and mobilization methods.',
            'Identify and locate common trigger points in the body.',
            'Apply pressure point therapy for pain relief.',
            'Maintain proper posture and prevent therapist injury.',
            'Professional draping techniques and client positioning.',
            'Conduct thorough client assessments before treatment.',
            'Develop effective treatment plans based on client needs.',
            'Maintain appropriate professional boundaries with clients.',
            'Recognize contraindications and ensure client safety.',
            'Implement proper hygiene and sanitation protocols.',
            'Select and maintain appropriate massage equipment.',
            'Keep accurate treatment records and documentation.',
            'Communicate effectively with clients and colleagues.'
        ];

        $title = $this->faker->randomElement($lessonTitles);
        $description = $this->faker->randomElement($descriptions);

        return [
            'module_id' => Module::factory(),
            'title' => $title,
            'description' => $description,
            'content' => $this->generateLessonContent($title, $description),
            'video_url' => $this->faker->randomElement([
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
            ]),
            'video_duration' => $this->faker->numberBetween(300, 3600), // 5 minutes to 1 hour
            'order' => $this->faker->numberBetween(1, 20),
            'is_published' => $this->faker->boolean(90),
            'is_free' => $this->faker->boolean(20), // 20% chance of being free
            'has_quiz' => $this->faker->boolean(40), // 40% chance of having a quiz
            'quiz_questions' => $this->generateQuizQuestions(),
            'resources' => $this->generateResources(),
            'learning_objectives' => json_encode([
                'Understand the lesson concepts',
                'Apply techniques correctly',
                'Demonstrate proper form',
                'Complete practical exercises'
            ]),
            'estimated_duration' => $this->faker->numberBetween(15, 90), // minutes
            'difficulty_level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    private function generateLessonContent(string $title, string $description): string
    {
        return "<h2>{$title}</h2>
        <p>{$description}</p>
        
        <h3>Learning Objectives</h3>
        <ul>
            <li>Understand the key concepts and principles</li>
            <li>Apply the techniques demonstrated in the video</li>
            <li>Practice with proper form and safety</li>
            <li>Complete the practical exercises</li>
        </ul>
        
        <h3>Key Points</h3>
        <p>This lesson covers important aspects of massage therapy that will enhance your professional practice. Pay attention to the demonstration and practice the techniques shown.</p>
        
        <h3>Practice Instructions</h3>
        <p>After watching the video, practice the techniques on a partner or practice dummy. Focus on proper hand placement, pressure, and movement quality.</p>
        
        <h3>Safety Notes</h3>
        <p>Always ensure client comfort and communication. Stop immediately if the client experiences any discomfort or adverse reactions.</p>";
    }

    private function generateQuizQuestions(): ?array
    {
        if ($this->faker->boolean(60)) { // 60% chance of no quiz
            return null;
        }

        return [
            [
                'question' => 'What is the primary purpose of effleurage strokes?',
                'options' => [
                    'Deep tissue manipulation',
                    'Relaxation and circulation',
                    'Joint mobilization',
                    'Trigger point release'
                ],
                'correct_answer' => 1,
                'explanation' => 'Effleurage strokes are primarily used for relaxation and improving circulation.'
            ],
            [
                'question' => 'Which of the following is a contraindication for massage?',
                'options' => [
                    'Muscle tension',
                    'Stress',
                    'Acute inflammation',
                    'Poor circulation'
                ],
                'correct_answer' => 2,
                'explanation' => 'Acute inflammation is a contraindication as massage could worsen the condition.'
            ],
            [
                'question' => 'What should you do if a client experiences pain during treatment?',
                'options' => [
                    'Continue with less pressure',
                    'Stop immediately and assess',
                    'Ignore if minor',
                    'Increase pressure to work through it'
                ],
                'correct_answer' => 1,
                'explanation' => 'Always stop and assess when a client experiences pain to ensure safety.'
            ]
        ];
    }

    private function generateResources(): array
    {
        return [
            [
                'title' => 'Anatomy Reference Chart',
                'type' => 'pdf',
                'url' => '/storage/resources/anatomy-chart.pdf',
                'description' => 'Detailed muscle and skeletal reference chart'
            ],
            [
                'title' => 'Technique Checklist',
                'type' => 'pdf',
                'url' => '/storage/resources/technique-checklist.pdf',
                'description' => 'Step-by-step checklist for proper technique'
            ],
            [
                'title' => 'Practice Log Template',
                'type' => 'pdf',
                'url' => '/storage/resources/practice-log.pdf',
                'description' => 'Template for tracking practice sessions'
            ]
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
        ]);
    }

    public function withQuiz(): static
    {
        return $this->state(fn (array $attributes) => [
            'has_quiz' => true,
            'quiz_questions' => $this->generateQuizQuestions(),
        ]);
    }

    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_free' => true,
        ]);
    }

    public function forModule(Module $module): static
    {
        return $this->state(fn (array $attributes) => [
            'module_id' => $module->id,
        ]);
    }
}
