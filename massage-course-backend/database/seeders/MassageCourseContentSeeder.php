<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\Lesson;

class MassageCourseContentSeeder extends Seeder
{
    public function run(): void
    {
        $moduleData = [
            [
                'title_en' => "Let's Get This Party Started",
                'title_ru' => "Давайте начнем эту вечеринку",
                'description_en' => "Welcome to your massage therapy journey! Get oriented and ready to begin.",
                'description_ru' => "Добро пожаловать в ваш путь массажной терапии! Ориентируйтесь и будьте готовы начать.",
                'duration' => 45,
                'lessons' => [
                    [
                        'title_en' => "Hey, Welcome to the Course!",
                        'title_ru' => "Привет, добро пожаловать на курс!",
                        'description_en' => "Get excited about your massage journey! Learn what makes a great massage therapist.",
                        'description_ru' => "Получите удовольствие от массажного путешествия! Узнайте, что делает отличного массажиста.",
                        'duration' => 15,
                        'is_free' => true
                    ],
                    [
                        'title_en' => "What Makes You Awesome at This?",
                        'title_ru' => "Что делает вас потрясающими в этом?",
                        'description_en' => "Discover the qualities that separate good massage therapists from great ones.",
                        'description_ru' => "Откройте качества, которые отличают хороших массажистов от великих.",
                        'duration' => 12,
                        'is_free' => true
                    ],
                    [
                        'title_en' => "How This Course Works",
                        'title_ru' => "Как работает этот курс",
                        'description_en' => "Your roadmap to massage mastery - from basics to business, no boring stuff!",
                        'description_ru' => "Ваша дорожная карта к мастерству массажа - от основ до бизнеса, никакой скуки!",
                        'duration' => 18,
                        'is_free' => false
                    ]
                ]
            ],
            [
                'title_en' => "The Stuff That Really, REALLY Matters",
                'title_ru' => "То, что действительно, ДЕЙСТВИТЕЛЬНО важно",
                'description_en' => "Essential foundations that will make or break your massage therapy success.",
                'description_ru' => "Основы, которые определят успех или неудачу в массажной терапии.",
                'duration' => 180,
                'lessons' => [
                    [
                        'title_en' => "Why This Chapter Will Save Your Career",
                        'title_ru' => "Почему эта глава спасет вашу карьеру",
                        'description_en' => "Real stories of what happens when you get the basics wrong.",
                        'description_ru' => "Реальные истории о том, что происходит, когда вы неправильно понимаете основы.",
                        'duration' => 25,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Choosing Your Massage Table",
                        'title_ru' => "Выбор массажного стола",
                        'description_en' => "Everything you need to know about selecting the perfect massage table.",
                        'description_ru' => "Все, что нужно знать о выборе идеального массажного стола.",
                        'duration' => 30,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "The Great Oil vs. Cream Debate",
                        'title_ru' => "Великие дебаты: масло против крема",
                        'description_en' => "Understand when and why to use different massage mediums.",
                        'description_ru' => "Поймите, когда и почему использовать разные массажные средства.",
                        'duration' => 20,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Setting Up Your Table",
                        'title_ru' => "Настройка стола",
                        'description_en' => "Professional setup that creates comfort and prevents disasters.",
                        'description_ru' => "Профессиональная настройка, которая создает комфорт и предотвращает катастрофы.",
                        'duration' => 25,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "The Little Things That Make You a Wizard",
                        'title_ru' => "Мелочи, которые делают вас волшебником",
                        'description_en' => "Simple tricks that will make clients think you have magical powers.",
                        'description_ru' => "Простые трюки, которые заставят клиентов думать, что у вас есть волшебные силы.",
                        'duration' => 20,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Time Management Mastery",
                        'title_ru' => "Мастерство управления временем",
                        'description_en' => "How to manage sessions professionally and avoid disasters.",
                        'description_ru' => "Как профессионально управлять сессиями и избегать катастроф.",
                        'duration' => 15,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Professional Boundaries",
                        'title_ru' => "Профессиональные границы",
                        'description_en' => "What areas to avoid and how to maintain professionalism.",
                        'description_ru' => "Каких областей избегать и как поддерживать профессионализм.",
                        'duration' => 20,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Save Your Body, Save Your Career",
                        'title_ru' => "Сохраните тело, сохраните карьеру",
                        'description_en' => "Body mechanics that will keep you healthy for decades.",
                        'description_ru' => "Механика тела, которая сохранит ваше здоровье на десятилетия.",
                        'duration' => 25,
                        'is_free' => false
                    ]
                ]
            ],
            [
                'title_en' => "Body Basics (The Non-Boring Version)",
                'title_ru' => "Основы тела (нескучная версия)",
                'description_en' => "Essential anatomy and physiology knowledge for effective massage therapy.",
                'description_ru' => "Основные знания анатомии и физиологии для эффективной массажной терапии.",
                'duration' => 140,
                'lessons' => [
                    [
                        'title_en' => "Anatomy Basics",
                        'title_ru' => "Основы анатомии",
                        'description_en' => "Fundamental anatomical knowledge without the medical school boredom.",
                        'description_ru' => "Основные анатомические знания без скуки медицинского института.",
                        'duration' => 25,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "The Muscles You Need to Know",
                        'title_ru' => "Мышцы, которые нужно знать",
                        'description_en' => "Key muscle groups that cause the most problems for your clients.",
                        'description_ru' => "Ключевые группы мышц, которые вызывают больше всего проблем у ваших клиентов.",
                        'duration' => 30,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Understanding Fascia and Blood Flow",
                        'title_ru' => "Понимание фасции и кровотока",
                        'description_en' => "How fascia and circulation affect your massage work.",
                        'description_ru' => "Как фасция и кровообращение влияют на вашу массажную работу.",
                        'duration' => 25,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Common Problems You'll See",
                        'title_ru' => "Распространенные проблемы",
                        'description_en' => "Typical client issues and how to address them safely.",
                        'description_ru' => "Типичные проблемы клиентов и способы их безопасного решения.",
                        'duration' => 30,
                        'is_free' => false
                    ]
                ]
            ],
            [
                'title_en' => "Techniques That Actually Work",
                'title_ru' => "Техники, которые действительно работают",
                'description_en' => "Master the core massage techniques that form the foundation of effective therapy.",
                'description_ru' => "Освойте основные техники массажа, составляющие основу эффективной терапии.",
                'duration' => 150,
                'lessons' => [
                    [
                        'title_en' => "Soft Hands - Your Secret Weapon",
                        'title_ru' => "Мягкие руки - ваше секретное оружие",
                        'description_en' => "Developing sensitive, effective touch that clients love.",
                        'description_ru' => "Развитие чувствительного, эффективного прикосновения, которое любят клиенты.",
                        'duration' => 25,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Effleurage Mastery",
                        'title_ru' => "Мастерство эфлеража",
                        'description_en' => "Perfect the foundational long stroke technique.",
                        'description_ru' => "Усовершенствуйте основную технику длинных движений.",
                        'duration' => 30,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Petrissage Techniques",
                        'title_ru' => "Техники петриссажа",
                        'description_en' => "Kneading techniques like making bread, but with people.",
                        'description_ru' => "Техники разминания, как приготовление хлеба, но с людьми.",
                        'duration' => 35,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Compression and Friction Work",
                        'title_ru' => "Компрессия и фрикционная работа",
                        'description_en' => "Power moves using forearms and precise friction techniques.",
                        'description_ru' => "Силовые движения с использованием предплечий и точные техники трения.",
                        'duration' => 40,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Putting It All Together",
                        'title_ru' => "Объединяем все вместе",
                        'description_en' => "Creating flowing, effective massage sequences.",
                        'description_ru' => "Создание плавных, эффективных массажных последовательностей.",
                        'duration' => 20,
                        'is_free' => false
                    ]
                ]
            ],
            [
                'title_en' => "The Full Body Massage Sequence",
                'title_ru' => "Последовательность массажа всего тела",
                'description_en' => "Learn the complete full-body massage sequence from start to finish.",
                'description_ru' => "Изучите полную последовательность массажа всего тела от начала до конца.",
                'duration' => 200,
                'lessons' => [
                    [
                        'title_en' => "Feet First - Everyone's Secret Favorite",
                        'title_ru' => "Ноги первыми - секретный фаворит всех",
                        'description_en' => "Starting with feet massage techniques that clients love.",
                        'description_ru' => "Начинаем с техник массажа ног, которые обожают клиенты.",
                        'duration' => 25,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Legs - The Workhorses",
                        'title_ru' => "Ноги - рабочие лошадки",
                        'description_en' => "Comprehensive leg massage for circulation and relaxation.",
                        'description_ru' => "Комплексный массаж ног для кровообращения и расслабления.",
                        'duration' => 30,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "The Back - Where All the Magic Happens",
                        'title_ru' => "Спина - где происходит вся магия",
                        'description_en' => "Master back massage for maximum therapeutic benefit.",
                        'description_ru' => "Освойте массаж спины для максимальной терапевтической пользы.",
                        'duration' => 45,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Neck and Head - The Grand Finale",
                        'title_ru' => "Шея и голова - великий финал",
                        'description_en' => "Specialized techniques for neck and head massage.",
                        'description_ru' => "Специализированные техники массажа шеи и головы.",
                        'duration' => 35,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "The Perfect Ending",
                        'title_ru' => "Идеальное окончание",
                        'description_en' => "How to conclude sessions professionally and memorably.",
                        'description_ru' => "Как завершить сессии профессионально и запоминающе.",
                        'duration' => 15,
                        'is_free' => false
                    ]
                ]
            ],
            [
                'title_en' => "Building Your Massage Business",
                'title_ru' => "Создание массажного бизнеса",
                'description_en' => "Build a successful massage therapy career with business skills and strategies.",
                'description_ru' => "Постройте успешную карьеру массажного терапевта с бизнес-навыками и стратегиями.",
                'duration' => 90,
                'lessons' => [
                    [
                        'title_en' => "Different Ways to Work",
                        'title_ru' => "Разные способы работы",
                        'description_en' => "Explore mobile, home studio, and employment options.",
                        'description_ru' => "Исследуйте мобильные, домашние студии и варианты трудоустройства.",
                        'duration' => 25,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "The Business Side",
                        'title_ru' => "Бизнес-сторона",
                        'description_en' => "Legal, insurance, and financial essentials for massage therapists.",
                        'description_ru' => "Юридические, страховые и финансовые основы для массажистов.",
                        'duration' => 30,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Getting and Keeping Clients",
                        'title_ru' => "Получение и удержание клиентов",
                        'description_en' => "Marketing and client relationship strategies that work.",
                        'description_ru' => "Стратегии маркетинга и отношений с клиентами, которые работают.",
                        'duration' => 35,
                        'is_free' => false
                    ]
                ]
            ],
            [
                'title_en' => "Special Situations and Advanced Techniques",
                'title_ru' => "Особые ситуации и продвинутые техники",
                'description_en' => "Handle special populations and advanced massage scenarios confidently.",
                'description_ru' => "Уверенно работайте с особыми группами и продвинутыми массажными сценариями.",
                'duration' => 120,
                'lessons' => [
                    [
                        'title_en' => "Essential Oils - Making Good Massage Great",
                        'title_ru' => "Эфирные масла - делаем хороший массаж отличным",
                        'description_en' => "Safe and effective essential oil use in massage therapy.",
                        'description_ru' => "Безопасное и эффективное использование эфирных масел в массажной терапии.",
                        'duration' => 30,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Special Populations",
                        'title_ru' => "Особые группы населения",
                        'description_en' => "Adapting techniques for elderly, pregnant, and athletic clients.",
                        'description_ru' => "Адаптация техник для пожилых, беременных и спортивных клиентов.",
                        'duration' => 40,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Common Problems and Solutions",
                        'title_ru' => "Распространенные проблемы и решения",
                        'description_en' => "Troubleshoot challenges and handle difficult situations.",
                        'description_ru' => "Решение проблем и работа со сложными ситуациями.",
                        'duration' => 25,
                        'is_free' => false
                    ],
                    [
                        'title_en' => "Your Massage Journey Starts Now!",
                        'title_ru' => "Ваше массажное путешествие начинается сейчас!",
                        'description_en' => "Final thoughts and next steps for your massage career.",
                        'description_ru' => "Заключительные мысли и следующие шаги для вашей массажной карьеры.",
                        'duration' => 25,
                        'is_free' => false
                    ]
                ]
            ]
        ];

        foreach (['en', 'ru'] as $language) {
            foreach ($moduleData as $moduleIndex => $moduleInfo) {
                $module = Module::create([
                    'title' => $language === 'en' ? $moduleInfo['title_en'] : $moduleInfo['title_ru'],
                    'description' => $language === 'en' ? $moduleInfo['description_en'] : $moduleInfo['description_ru'],
                    'language' => $language,
                    'order' => $moduleIndex + 1,
                    'duration_minutes' => $moduleInfo['duration'],
                    'learning_objectives' => json_encode([
                        $language === 'en' ? 'Master the core concepts presented in this module' : 'Освойте основные концепции, представленные в этом модуле',
                        $language === 'en' ? 'Apply techniques safely and effectively' : 'Применяйте техники безопасно и эффективно',
                        $language === 'en' ? 'Build confidence in professional practice' : 'Развивайте уверенность в профессиональной практике'
                    ]),
                    'is_published' => true
                ]);

                foreach ($moduleInfo['lessons'] as $lessonIndex => $lessonInfo) {
                    Lesson::create([
                        'module_id' => $module->id,
                        'title' => $language === 'en' ? $lessonInfo['title_en'] : $lessonInfo['title_ru'],
                        'description' => $language === 'en' ? $lessonInfo['description_en'] : $lessonInfo['description_ru'],
                        'content' => $this->generateLessonContent(
                            $language === 'en' ? $lessonInfo['title_en'] : $lessonInfo['title_ru'],
                            $language === 'en' ? $lessonInfo['description_en'] : $lessonInfo['description_ru'],
                            $language
                        ),
                        'language' => $language,
                        'video_url' => null,
                        'video_duration' => null,
                        'duration_minutes' => $lessonInfo['duration'],
                        'thumbnail' => null,
                        'order' => $lessonIndex + 1,
                        'is_published' => true,
                        'is_free' => $lessonInfo['is_free'],
                        'has_quiz' => $lessonIndex % 3 === 2,
                        'resources' => json_encode($this->generateResources($language)),
                        'quiz_questions' => $lessonIndex % 3 === 2 ? json_encode($this->generateQuiz($language)) : null,
                        'learning_objectives' => json_encode([
                            $language === 'en' ? 'Understand the key concepts presented' : 'Понять ключевые концепции',
                            $language === 'en' ? 'Apply techniques correctly' : 'Правильно применять техники',
                            $language === 'en' ? 'Practice with confidence' : 'Практиковать с уверенностью'
                        ]),
                        'estimated_duration' => $lessonInfo['duration'],
                        'difficulty_level' => $moduleIndex < 2 ? 'beginner' : ($moduleIndex < 5 ? 'intermediate' : 'advanced'),
                    ]);
                }
            }
        }

        $this->command->info('Massage course content seeded successfully!');
        $this->command->info('Created modules and lessons in both English and Russian.');
        $this->command->info('Total modules per language: ' . count($moduleData));
        $this->command->info('Total lessons per language: ' . collect($moduleData)->sum(fn($m) => count($m['lessons'])));
    }

    private function generateLessonContent(string $title, string $description, string $language): string
    {
        if ($language === 'en') {
            return "<h2>{$title}</h2>
            <p>{$description}</p>
            
            <h3>What You'll Learn</h3>
            <ul>
                <li>Master the core concepts and techniques</li>
                <li>Apply skills safely and professionally</li>
                <li>Build confidence through practice</li>
                <li>Understand real-world applications</li>
            </ul>
            
            <h3>Key Takeaways</h3>
            <p>This lesson provides essential knowledge and practical skills that will enhance your massage therapy practice. Focus on understanding the principles and practicing the techniques until they become natural.</p>
            
            <h3>Practice Notes</h3>
            <p>Take time to practice each technique slowly and carefully. Quality is more important than speed. Always prioritize client safety and comfort.</p>";
        } else {
            return "<h2>{$title}</h2>
            <p>{$description}</p>
            
            <h3>Что вы изучите</h3>
            <ul>
                <li>Освоите основные концепции и техники</li>
                <li>Применяйте навыки безопасно и профессионально</li>
                <li>Развивайте уверенность через практику</li>
                <li>Поймете практические применения</li>
            </ul>
            
            <h3>Ключевые выводы</h3>
            <p>Этот урок предоставляет важные знания и практические навыки, которые улучшат вашу практику массажной терапии. Сосредоточьтесь на понимании принципов и практике техник, пока они не станут естественными.</p>
            
            <h3>Заметки по практике</h3>
            <p>Уделите время практике каждой техники медленно и осторожно. Качество важнее скорости. Всегда отдавайте приоритет безопасности и комфорту клиента.</p>";
        }
    }

    private function generateResources(string $language): array
    {
        if ($language === 'en') {
            return [
                [
                    'title' => 'Anatomy Reference Guide',
                    'type' => 'pdf',
                    'url' => '/storage/resources/anatomy-guide.pdf',
                    'description' => 'Comprehensive anatomy reference for massage therapists'
                ],
                [
                    'title' => 'Technique Checklist',
                    'type' => 'pdf',
                    'url' => '/storage/resources/technique-checklist.pdf',
                    'description' => 'Step-by-step checklist for proper technique'
                ]
            ];
        } else {
            return [
                [
                    'title' => 'Справочник по анатомии',
                    'type' => 'pdf',
                    'url' => '/storage/resources/anatomy-guide-ru.pdf',
                    'description' => 'Комплексный справочник по анатомии для массажистов'
                ],
                [
                    'title' => 'Контрольный список техник',
                    'type' => 'pdf',
                    'url' => '/storage/resources/technique-checklist-ru.pdf',
                    'description' => 'Пошаговый контрольный список для правильной техники'
                ]
            ];
        }
    }

    private function generateQuiz(string $language): array
    {
        if ($language === 'en') {
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
                ]
            ];
        } else {
            return [
                [
                    'question' => 'Какова основная цель движений эфлеража?',
                    'options' => [
                        'Глубокая работа с тканями',
                        'Расслабление и кровообращение',
                        'Мобилизация суставов',
                        'Работа с триггерными точками'
                    ],
                    'correct_answer' => 1,
                    'explanation' => 'Движения эфлеража в основном используются для расслабления и улучшения кровообращения.'
                ]
            ];
        }
    }
}