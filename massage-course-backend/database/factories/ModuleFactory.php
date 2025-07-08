<?php

namespace Database\Factories;

use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

class ModuleFactory extends Factory
{
    protected $model = Module::class;

    private $massageModules = [
        [
            'title' => 'Let\'s Get This Party Started',
            'description' => 'Welcome to your massage therapy journey! Learn the foundations, course structure, and what makes an excellent massage therapist.',
            'duration_minutes' => 120,
            'learning_objectives' => [
                'Understand the course structure and expectations',
                'Learn what makes an excellent massage therapist',
                'Set realistic goals for your massage journey',
                'Develop proper mindset for learning massage therapy'
            ]
        ],
        [
            'title' => 'The Stuff That Really, REALLY Matters',
            'description' => 'Master the setup essentials that make or break a massage experience. From table selection to proper draping, these fundamentals are crucial.',
            'duration_minutes' => 180,
            'learning_objectives' => [
                'Select and set up massage equipment properly',
                'Master professional draping techniques',
                'Create the perfect massage environment',
                'Understand time management and boundaries'
            ]
        ],
        [
            'title' => 'Body Basics (The Non-Boring Version)',
            'description' => 'Learn essential anatomy and physiology for massage therapists. Understand muscles, bones, nerves, and how the body responds to touch.',
            'duration_minutes' => 150,
            'learning_objectives' => [
                'Identify key muscles and bone landmarks',
                'Understand nerve pathways and blood flow',
                'Recognize common problem areas',
                'Apply anatomical knowledge to massage practice'
            ]
        ],
        [
            'title' => 'Techniques That Actually Work',
            'description' => 'Master the fundamental massage techniques: effleurage, petrissage, compression, and friction. Learn to combine them effectively.',
            'duration_minutes' => 240,
            'learning_objectives' => [
                'Master effleurage for relaxation and circulation',
                'Perform effective petrissage techniques',
                'Use compression and friction safely',
                'Combine techniques for optimal results'
            ]
        ],
        [
            'title' => 'The Full Body Massage Sequence',
            'description' => 'Put it all together with a complete full-body massage sequence. Learn proper flow, timing, and how to create a transformative experience.',
            'duration_minutes' => 300,
            'learning_objectives' => [
                'Perform a complete full-body massage sequence',
                'Master professional draping and positioning',
                'Maintain proper flow and timing',
                'Create a memorable client experience'
            ]
        ],
        [
            'title' => 'Building Your Massage Business',
            'description' => 'Learn the business side of massage therapy. From legal requirements to client management, everything you need to succeed professionally.',
            'duration_minutes' => 180,
            'learning_objectives' => [
                'Understand legal and insurance requirements',
                'Develop pricing and service strategies',
                'Master client acquisition and retention',
                'Build a sustainable massage practice'
            ]
        ],
        [
            'title' => 'Special Situations and Advanced Techniques',
            'description' => 'Handle special populations, use essential oils safely, and advance your skills with specialized techniques for different client needs.',
            'duration_minutes' => 210,
            'learning_objectives' => [
                'Work safely with special populations',
                'Use essential oils effectively and safely',
                'Address common client concerns',
                'Develop advanced therapeutic skills'
            ]
        ]
    ];

    public function definition(): array
    {
        $moduleData = $this->faker->randomElement($this->massageModules);
        
        return [
            'title' => $moduleData['title'],
            'description' => $moduleData['description'],
            'duration_minutes' => $moduleData['duration_minutes'],
            'learning_objectives' => json_encode($moduleData['learning_objectives']),
            'order' => $this->faker->numberBetween(1, 10),
            'is_published' => $this->faker->boolean(90),
            'language' => $this->faker->randomElement(['en', 'es', 'fr']),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
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

    public function withSpecificModule(int $index): static
    {
        $moduleData = $this->massageModules[$index] ?? $this->massageModules[0];
        
        return $this->state(fn (array $attributes) => [
            'title' => $moduleData['title'],
            'description' => $moduleData['description'],
            'duration_minutes' => $moduleData['duration_minutes'],
            'learning_objectives' => json_encode($moduleData['learning_objectives']),
        ]);
    }
}