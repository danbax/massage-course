<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    private $massageLessons = [
        'Hey, Welcome to the Course!' => [
            'description' => 'Get excited about your massage journey! Learn what makes a great massage therapist and set your expectations for success.',
            'content' => '<h2>Welcome to Your Massage Journey!</h2><p>Hey there, future massage superstar! Ready to learn how to make people melt into puddles of relaxation? You\'re in the right place.</p>',
            'duration_minutes' => 15,
            'difficulty_level' => 'beginner',
            'is_free' => true
        ],
        'What Makes You Awesome at This?' => [
            'description' => 'Discover the qualities that separate good massage therapists from great ones. It\'s not just about technique!',
            'content' => '<h2>The Secret Sauce of Great Massage Therapists</h2><p>Being great at massage is about so much more than just knowing where to push and rub.</p>',
            'duration_minutes' => 20,
            'difficulty_level' => 'beginner',
            'is_free' => true
        ],
        'How This Course Works' => [
            'description' => 'Learn the course structure and how to get the most out of your learning experience.',
            'content' => '<h2>Your Learning Roadmap</h2><p>Here\'s how we\'re going to transform you into a massage wizard.</p>',
            'duration_minutes' => 10,
            'difficulty_level' => 'beginner',
            'is_free' => true
        ],
        'Why This Chapter Will Save Your Career' => [
            'description' => 'Learn from real-world mistakes and understand why setup and environment matter more than you think.',
            'content' => '<h2>The Mountain Massage Disaster</h2><p>Let me tell you a story about why setup matters...</p>',
            'duration_minutes' => 25,
            'difficulty_level' => 'beginner',
            'is_free' => false
        ],
        'Choosing Your Massage Table' => [
            'description' => 'Master the art of selecting the perfect massage table. Your back and your clients will thank you.',
            'content' => '<h2>Your New Best Friend</h2><p>Your massage table is like your trusty sidekick. Choose wrong, and you\'ll both be miserable.</p>',
            'duration_minutes' => 30,
            'difficulty_level' => 'beginner',
            'is_free' => false
        ],
        'The Great Oil vs. Cream Debate' => [
            'description' => 'Understand the pros and cons of different massage mediums and how to choose the right one.',
            'content' => '<h2>Team Cream vs Team Oil</h2><p>Let\'s settle this debate once and for all.</p>',
            'duration_minutes' => 20,
            'difficulty_level' => 'beginner',
            'is_free' => false
        ],
        'Setting Up Your Table' => [
            'description' => 'Learn the professional setup that creates comfort and prevents awkward situations.',
            'content' => '<h2>The Perfect Setup</h2><p>On your vinyl massage table, direct oil or cream contact is gross and messy.</p>',
            'duration_minutes' => 25,
            'difficulty_level' => 'beginner',
            'is_free' => false
        ],
        'The Little Things That Make You a Wizard' => [
            'description' => 'Discover simple tricks that will make clients think you have magical powers.',
            'content' => '<h2>Winter Magic and Secret Weapons</h2><p>Want to blow people\'s minds without breaking a sweat?</p>',
            'duration_minutes' => 20,
            'difficulty_level' => 'intermediate',
            'is_free' => false
        ],
        'Time Management Mastery' => [
            'description' => 'Learn to manage your time professionally and avoid common scheduling disasters.',
            'content' => '<h2>Your Phone Is Not a Clock</h2><p>I see you reaching for your phone to check the time. Stop it.</p>',
            'duration_minutes' => 15,
            'difficulty_level' => 'beginner',
            'is_free' => false
        ],
        'Professional Boundaries' => [
            'description' => 'Understand what areas to avoid and how to maintain professional boundaries.',
            'content' => '<h2>The "Nope" List</h2><p>Let\'s talk boundaries—starting with what I call The Chest Situation.</p>',
            'duration_minutes' => 20,
            'difficulty_level' => 'beginner',
            'is_free' => false
        ],
        'Anatomy Basics for Massage' => [
            'description' => 'Learn essential anatomy without the boring medical textbook approach.',
            'content' => '<h2>Body Basics (The Non-Boring Version)</h2><p>I\'m not going to make you memorize every muscle in Latin.</p>',
            'duration_minutes' => 45,
            'difficulty_level' => 'intermediate',
            'is_free' => false
        ],
        'The Muscles You Need to Know' => [
            'description' => 'Focus on the muscles that matter most for massage therapy—the troublemakers.',
            'content' => '<h2>The Tension Troublemakers</h2><p>There are over 600 muscles in the human body, but we\'re focusing on the ones that cause the most problems.</p>',
            'duration_minutes' => 40,
            'difficulty_level' => 'intermediate',
            'is_free' => false
        ],
        'Understanding Fascia and Blood Flow' => [
            'description' => 'Learn about fascia, blood circulation, and how they affect your massage work.',
            'content' => '<h2>The Body\'s Hidden Network</h2><p>Fascia is everywhere—it\'s like plastic wrap that covers every muscle, organ, and nerve.</p>',
            'duration_minutes' => 30,
            'difficulty_level' => 'intermediate',
            'is_free' => false
        ],
        'Soft Hands - Your Secret Weapon' => [
            'description' => 'Master the foundation of all great massage: developing soft, sensitive hands.',
            'content' => '<h2>The Cat Test</h2><p>Hard hands equal unhappy clients. Imagine you\'re petting a cat.</p>',
            'duration_minutes' => 25,
            'difficulty_level' => 'beginner',
            'is_free' => false
        ],
        'Effleurage Mastery' => [
            'description' => 'Learn the art of long, flowing strokes that form the foundation of relaxation massage.',
            'content' => '<h2>Your Bread and Butter</h2><p>This is your opening act, your "hello, nice to meet you" for muscles.</p>',
            'duration_minutes' => 35,
            'difficulty_level' => 'beginner',
            'is_free' => false
        ],
        'Petrissage Techniques' => [
            'description' => 'Master the kneading techniques that work deep into muscle tissue.',
            'content' => '<h2>Like Making Bread, But With People</h2><p>Channel your inner baker, but instead of sourdough, you\'re making muscles happy.</p>',
            'duration_minutes' => 40,
            'difficulty_level' => 'intermediate',
            'is_free' => false
        ],
        'Compression and Friction Work' => [
            'description' => 'Learn to use your forearms effectively and perform precise friction techniques.',
            'content' => '<h2>The Power Moves</h2><p>Time to bring out the big guns—your forearms!</p>',
            'duration_minutes' => 45,
            'difficulty_level' => 'intermediate',
            'is_free' => false
        ],
        'Building Your Full Body Sequence' => [
            'description' => 'Put all techniques together into a flowing, professional full-body massage.',
            'content' => '<h2>The Main Event</h2><p>Great massage isn\'t about doing every technique in the book—it\'s about flow.</p>',
            'duration_minutes' => 60,
            'difficulty_level' => 'advanced',
            'is_free' => false
        ],
        'Working with Special Populations' => [
            'description' => 'Learn to adapt your techniques for elderly clients, athletes, and pregnant women.',
            'content' => '<h2>Not Everyone Is the Same</h2><p>Different clients need different approaches.</p>',
            'duration_minutes' => 50,
            'difficulty_level' => 'advanced',
            'is_free' => false
        ],
        'Essential Oils Safety and Application' => [
            'description' => 'Learn to use essential oils safely and effectively in your massage practice.',
            'content' => '<h2>Making Good Massage Great</h2><p>Adding essential oils is like putting sprinkles on ice cream.</p>',
            'duration_minutes' => 35,
            'difficulty_level' => 'intermediate',
            'is_free' => false
        ]
    ];

    public function definition(): array
    {
        $lessonTitle = $this->faker->randomElement(array_keys($this->massageLessons));
        $lessonData = $this->massageLessons[$lessonTitle];

        return [
            'module_id' => Module::factory(),
            'title' => $lessonTitle,
            'description' => $lessonData['description'],
            'content' => $this->generateFullContent($lessonTitle, $lessonData['content']),
            'video_url' => $this->faker->randomElement([
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
            ]),
            'video_duration' => $this->faker->numberBetween(300, 3600),
            'duration_minutes' => $lessonData['duration_minutes'],
            'thumbnail' => null,
            'order' => $this->faker->numberBetween(1, 20),
            'is_published' => $this->faker->boolean(90),
            'is_free' => $lessonData['is_free'],
            'has_quiz' => $this->faker->boolean(40),
            'resources' => $this->generateMassageResources(),
            'quiz_questions' => $this->generateMassageQuiz(),
            'learning_objectives' => json_encode([
                'Master the core concepts presented',
                'Apply techniques safely and effectively',
                'Demonstrate proper form and positioning',
                'Complete practical exercises with confidence'
            ]),
            'estimated_duration' => $lessonData['duration_minutes'],
            'difficulty_level' => $lessonData['difficulty_level'],
            'language' => $this->faker->randomElement(['en', 'es', 'fr']),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    private function generateFullContent(string $title, string $intro): string
    {
        return "{$intro}
        
        <h3>Learning Objectives</h3>
        <ul>
            <li>Understand the key concepts and principles covered in this lesson</li>
            <li>Apply the techniques demonstrated safely and effectively</li>
            <li>Practice with proper form, pressure, and body mechanics</li>
            <li>Complete all practical exercises and assessments</li>
        </ul>
        
        <h3>Key Points to Remember</h3>
        <p>This lesson covers essential aspects of professional massage therapy that will enhance your practice and client satisfaction. Pay close attention to the demonstrations and practice the techniques shown until they become second nature.</p>
        
        <h3>Practice Instructions</h3>
        <p>After watching the video content, practice the techniques on a partner or practice client. Focus on proper hand placement, appropriate pressure levels, and maintaining good body mechanics throughout the session.</p>
        
        <h3>Safety and Professional Notes</h3>
        <p>Always prioritize client comfort and maintain clear communication throughout your practice sessions. Stop immediately if any discomfort or adverse reactions occur, and remember that building trust and professionalism is just as important as technical skill.</p>";
    }

    private function generateMassageQuiz(): ?array
    {
        if ($this->faker->boolean(60)) {
            return null;
        }

        $quizOptions = [
            [
                'question' => 'What is the primary purpose of effleurage strokes in massage?',
                'options' => [
                    'Deep tissue manipulation and trigger point release',
                    'Relaxation, circulation improvement, and warming tissues',
                    'Joint mobilization and stretching',
                    'Breaking up scar tissue and adhesions'
                ],
                'correct_answer' => 1,
                'explanation' => 'Effleurage strokes are primarily used for relaxation, improving circulation, and warming up tissues before deeper work.'
            ],
            [
                'question' => 'Which of the following is a contraindication for massage therapy?',
                'options' => [
                    'General muscle tension and stress',
                    'Poor circulation and lymphatic congestion',
                    'Acute inflammation or recent injury',
                    'Chronic pain conditions'
                ],
                'correct_answer' => 2,
                'explanation' => 'Acute inflammation is a contraindication because massage could worsen the inflammatory response and delay healing.'
            ],
            [
                'question' => 'What should you do if a client experiences unexpected pain during treatment?',
                'options' => [
                    'Continue with the same pressure to work through it',
                    'Stop immediately, assess the situation, and adjust accordingly',
                    'Ignore minor complaints and continue the session',
                    'Increase pressure to break through muscle resistance'
                ],
                'correct_answer' => 1,
                'explanation' => 'Client safety is paramount. Always stop and assess when unexpected pain occurs to ensure no harm is being done.'
            ]
        ];

        return [$this->faker->randomElement($quizOptions)];
    }

    private function generateMassageResources(): array
    {
        return [
            [
                'title' => 'Muscle Anatomy Reference Guide',
                'type' => 'pdf',
                'url' => '/storage/resources/muscle-anatomy-guide.pdf',
                'description' => 'Comprehensive guide to major muscle groups and their functions'
            ],
            [
                'title' => 'Massage Technique Checklist',
                'type' => 'pdf',
                'url' => '/storage/resources/technique-checklist.pdf',
                'description' => 'Step-by-step checklist for proper massage technique execution'
            ],
            [
                'title' => 'Client Assessment Form',
                'type' => 'pdf',
                'url' => '/storage/resources/client-assessment-form.pdf',
                'description' => 'Professional intake form for new massage clients'
            ],
            [
                'title' => 'Body Mechanics Guide',
                'type' => 'pdf',
                'url' => '/storage/resources/body-mechanics-guide.pdf',
                'description' => 'Essential guide to protecting your body while giving massages'
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
            'quiz_questions' => $this->generateMassageQuiz(),
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

    public function sequential(): static
    {
        static $order = 0;
        $order++;
        
        return $this->state(fn (array $attributes) => [
            'order' => $order,
        ]);
    }
}