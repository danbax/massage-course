<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\Lesson;

class MassageCourseContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Module and lesson data for both languages
        $moduleData = [
            [
                'title_en' => "Let's Get This Party Started",
                'title_ru' => "Давайте начнем эту вечеринку",
                'description_en' => "Welcome to your massage therapy journey! Get oriented and ready to begin.",
                'description_ru' => "Добро пожаловать в ваш путь массажной терапии! Ориентируйтесь и будьте готовы начать.",
                'lessons' => [
                    [
                        'title_en' => "Hey, Welcome to the Course!",
                        'title_ru' => "Привет, добро пожаловать на курс!",
                        'description_en' => "Your warm welcome and introduction to the course journey ahead.",
                        'description_ru' => "Теплое приветствие и введение в предстоящий курс."
                    ],
                    [
                        'title_en' => "What Makes You Awesome at This?",
                        'title_ru' => "Что делает вас потрясающими в этом?",
                        'description_en' => "Discover your natural talents and what will make you successful.",
                        'description_ru' => "Откройте свои природные таланты и то, что сделает вас успешными."
                    ],
                    [
                        'title_en' => "How This Course Works (No Boring Stuff, Promise!)",
                        'title_ru' => "Как работает этот курс (никакой скуки, обещаем!)",
                        'description_en' => "Navigate the course structure and learning approach effectively.",
                        'description_ru' => "Эффективно освойте структуру курса и подход к обучению."
                    ]
                ]
            ],
            [
                'title_en' => "The Stuff That Really, REALLY Matters",
                'title_ru' => "То, что действительно, ДЕЙСТВИТЕЛЬНО важно",
                'description_en' => "Essential foundations that will make or break your massage therapy success.",
                'description_ru' => "Основы, которые определят успех или неудачу в массажной терапии.",
                'lessons' => [
                    [
                        'title_en' => "Why This Chapter Will Save Your Career",
                        'title_ru' => "Почему эта глава спасет вашу карьеру",
                        'description_en' => "Understanding the critical importance of proper foundations.",
                        'description_ru' => "Понимание критической важности правильных основ."
                    ],
                    [
                        'title_en' => "Choosing Your Massage Table (AKA Your New Best Friend)",
                        'title_ru' => "Выбор массажного стола (он же ваш новый лучший друг)",
                        'description_en' => "Everything you need to know about selecting the right massage table.",
                        'description_ru' => "Все, что нужно знать о выборе правильного массажного стола."
                    ],
                    [
                        'title_en' => "The Great Oil vs. Cream Debate",
                        'title_ru' => "Великие дебаты: масло против крема",
                        'description_en' => "Understand when and why to use different massage mediums.",
                        'description_ru' => "Поймите, когда и почему использовать разные массажные средства."
                    ],
                    [
                        'title_en' => "Setting Up Your Table (It's Not Rocket Science, But Almost)",
                        'title_ru' => "Настройка стола (это не ракетостроение, но почти)",
                        'description_en' => "Proper table setup for comfort and professionalism.",
                        'description_ru' => "Правильная настройка стола для комфорта и профессионализма."
                    ],
                    [
                        'title_en' => "The Little Things That Make People Think You're a Wizard",
                        'title_ru' => "Мелочи, которые заставляют людей думать, что вы волшебник",
                        'description_en' => "Professional touches that elevate your practice.",
                        'description_ru' => "Профессиональные штрихи, которые поднимают вашу практику."
                    ],
                    [
                        'title_en' => "Time Management (Or: How Not to Be THAT Therapist)",
                        'title_ru' => "Управление временем (или: как не быть ТЕМ терапевтом)",
                        'description_en' => "Effective scheduling and session management techniques.",
                        'description_ru' => "Эффективные методы планирования и управления сессиями."
                    ],
                    [
                        'title_en' => "The \"Nope\" List (Areas We Don't Go)",
                        'title_ru' => "Список \"Нет\" (области, куда мы не идем)",
                        'description_en' => "Understanding professional boundaries and contraindications.",
                        'description_ru' => "Понимание профессиональных границ и противопоказаний."
                    ],
                    [
                        'title_en' => "When to Say \"That's Above My Pay Grade\"",
                        'title_ru' => "Когда сказать \"это выше моего уровня\"",
                        'description_en' => "Recognizing when to refer clients to medical professionals.",
                        'description_ru' => "Распознавание, когда направить клиентов к медицинским специалистам."
                    ],
                    [
                        'title_en' => "Practice Makes Perfect (And Also Makes Money)",
                        'title_ru' => "Практика ведет к совершенству (и также приносит деньги)",
                        'description_en' => "Effective practice strategies for skill development.",
                        'description_ru' => "Эффективные стратегии практики для развития навыков."
                    ],
                    [
                        'title_en' => "Save Your Body, Save Your Career",
                        'title_ru' => "Сохраните свое тело, сохраните свою карьеру",
                        'description_en' => "Body mechanics and self-care for therapist longevity.",
                        'description_ru' => "Механика тела и забота о себе для долголетия терапевта."
                    ]
                ]
            ],
            [
                'title_en' => "Body Basics (The Non-Boring Version)",
                'title_ru' => "Основы тела (нескучная версия)",
                'description_en' => "Essential anatomy and physiology knowledge for effective massage therapy.",
                'description_ru' => "Основные знания анатомии и физиологии для эффективной массажной терапии.",
                'lessons' => [
                    [
                        'title_en' => "Anatomy Basics",
                        'title_ru' => "Основы анатомии",
                        'description_en' => "Fundamental anatomical knowledge for massage therapists.",
                        'description_ru' => "Основные анатомические знания для массажистов."
                    ],
                    [
                        'title_en' => "The Muscles You Need to Know",
                        'title_ru' => "Мышцы, которые вам нужно знать",
                        'description_en' => "Key muscle groups and their functions in massage therapy.",
                        'description_ru' => "Ключевые группы мышц и их функции в массажной терапии."
                    ],
                    [
                        'title_en' => "Bone Landmarks",
                        'title_ru' => "Костные ориентиры",
                        'description_en' => "Important anatomical landmarks for effective massage navigation.",
                        'description_ru' => "Важные анатомические ориентиры для эффективной навигации массажа."
                    ],
                    [
                        'title_en' => "Understanding Nerves",
                        'title_ru' => "Понимание нервов",
                        'description_en' => "Basic nervous system knowledge for safe massage practice.",
                        'description_ru' => "Основные знания нервной системы для безопасной практики массажа."
                    ],
                    [
                        'title_en' => "Blood Flow Basics",
                        'title_ru' => "Основы кровотока",
                        'description_en' => "Circulatory system fundamentals and massage effects.",
                        'description_ru' => "Основы кровеносной системы и воздействие массажа."
                    ],
                    [
                        'title_en' => "Understanding Fascia",
                        'title_ru' => "Понимание фасции",
                        'description_en' => "The role of fascia in body structure and massage therapy.",
                        'description_ru' => "Роль фасции в структуре тела и массажной терапии."
                    ],
                    [
                        'title_en' => "Common Problems You'll See",
                        'title_ru' => "Распространенные проблемы, которые вы увидите",
                        'description_en' => "Typical client issues and how to address them safely.",
                        'description_ru' => "Типичные проблемы клиентов и способы их безопасного решения."
                    ]
                ]
            ],
            [
                'title_en' => "Techniques That Actually Work",
                'title_ru' => "Техники, которые действительно работают",
                'description_en' => "Master the core massage techniques that form the foundation of effective therapy.",
                'description_ru' => "Освойте основные техники массажа, которые составляют основу эффективной терапии.",
                'lessons' => [
                    [
                        'title_en' => "Let's Get Technical (But Not Too Technical)",
                        'title_ru' => "Давайте станем техничными (но не слишком)",
                        'description_en' => "Introduction to massage technique principles and application.",
                        'description_ru' => "Введение в принципы техники массажа и их применение."
                    ],
                    [
                        'title_en' => "Soft Hands - Your Secret Weapon",
                        'title_ru' => "Мягкие руки - ваше секретное оружие",
                        'description_en' => "Developing sensitive, effective touch for better results.",
                        'description_ru' => "Развитие чувствительного, эффективного прикосновения для лучших результатов."
                    ],
                    [
                        'title_en' => "Effleurage (The Fancy Word for Long Strokes)",
                        'title_ru' => "Эфлераж (красивое слово для длинных движений)",
                        'description_en' => "Master the foundational long stroke technique.",
                        'description_ru' => "Освойте основную технику длинных движений."
                    ],
                    [
                        'title_en' => "Petrissage (Kneading - Like Making Bread But With People)",
                        'title_ru' => "Петриссаж (разминание - как делать хлеб, но с людьми)",
                        'description_en' => "Learn effective kneading techniques for muscle relaxation.",
                        'description_ru' => "Изучите эффективные техники разминания для расслабления мышц."
                    ],
                    [
                        'title_en' => "Compression - The Power Move",
                        'title_ru' => "Компрессия - силовой прием",
                        'description_en' => "Apply therapeutic pressure safely and effectively.",
                        'description_ru' => "Применяйте терапевтическое давление безопасно и эффективно."
                    ],
                    [
                        'title_en' => "Friction - The Detail Work",
                        'title_ru' => "Фрикция - детальная работа",
                        'description_en' => "Targeted friction techniques for specific muscle work.",
                        'description_ru' => "Целенаправленные техники трения для работы с конкретными мышцами."
                    ],
                    [
                        'title_en' => "Putting It All Together",
                        'title_ru' => "Собираем все вместе",
                        'description_en' => "Integrating techniques into flowing, effective massage sequences.",
                        'description_ru' => "Интеграция техник в плавные, эффективные последовательности массажа."
                    ]
                ]
            ],
            [
                'title_en' => "The Full Body Massage Sequence (The Main Event!)",
                'title_ru' => "Последовательность массажа всего тела (главное событие!)",
                'description_en' => "Learn the complete full-body massage sequence from start to finish.",
                'description_ru' => "Изучите полную последовательность массажа всего тела от начала до конца.",
                'lessons' => [
                    [
                        'title_en' => "Getting Your Head in the Game",
                        'title_ru' => "Настрой на игру",
                        'description_en' => "Mental preparation and setup for successful massage sessions.",
                        'description_ru' => "Ментальная подготовка и настройка для успешных сессий массажа."
                    ],
                    [
                        'title_en' => "Feet First (Everyone's Secret Favorite)",
                        'title_ru' => "Ноги первыми (секретный фаворит всех)",
                        'description_en' => "Effective foot massage techniques that clients love.",
                        'description_ru' => "Эффективные техники массажа ног, которые обожают клиенты."
                    ],
                    [
                        'title_en' => "Legs - The Workhorses",
                        'title_ru' => "Ноги - рабочие лошадки",
                        'description_en' => "Comprehensive leg massage for circulation and relaxation.",
                        'description_ru' => "Комплексный массаж ног для кровообращения и расслабления."
                    ],
                    [
                        'title_en' => "The Back - Where All the Magic Happens",
                        'title_ru' => "Спина - где происходит вся магия",
                        'description_en' => "Master back massage techniques for maximum therapeutic benefit.",
                        'description_ru' => "Освойте техники массажа спины для максимальной терапевтической пользы."
                    ],
                    [
                        'title_en' => "Neck and Head - The Grand Finale",
                        'title_ru' => "Шея и голова - великий финал",
                        'description_en' => "Specialized techniques for neck and head massage.",
                        'description_ru' => "Специализированные техники для массажа шеи и головы."
                    ],
                    [
                        'title_en' => "The Flip (Make It Smooth, Not Awkward)",
                        'title_ru' => "Переворот (сделайте это гладко, не неловко)",
                        'description_en' => "Professional techniques for client positioning changes.",
                        'description_ru' => "Профессиональные техники для изменения положения клиента."
                    ],
                    [
                        'title_en' => "Front of Body - The Victory Lap",
                        'title_ru' => "Передняя часть тела - круг почета",
                        'description_en' => "Complete front-body massage techniques and considerations.",
                        'description_ru' => "Полные техники массажа передней части тела и соображения."
                    ],
                    [
                        'title_en' => "The Perfect Ending",
                        'title_ru' => "Идеальное окончание",
                        'description_en' => "How to conclude sessions professionally and effectively.",
                        'description_ru' => "Как завершить сессии профессионально и эффективно."
                    ]
                ]
            ],
            [
                'title_en' => "Business and Career Development",
                'title_ru' => "Бизнес и карьерное развитие",
                'description_en' => "Build a successful massage therapy career with business skills and strategies.",
                'description_ru' => "Постройте успешную карьеру массажного терапевта с навыками и стратегиями бизнеса.",
                'lessons' => [
                    [
                        'title_en' => "Different Ways to Work (Pick Your Adventure)",
                        'title_ru' => "Разные способы работы (выберите свое приключение)",
                        'description_en' => "Explore various career paths in massage therapy.",
                        'description_ru' => "Исследуйте различные карьерные пути в массажной терапии."
                    ],
                    [
                        'title_en' => "The Business Side (The Not-Fun But Important Stuff)",
                        'title_ru' => "Бизнес-сторона (не веселая, но важная вещь)",
                        'description_en' => "Essential business knowledge for massage therapists.",
                        'description_ru' => "Основные бизнес-знания для массажных терапевтов."
                    ],
                    [
                        'title_en' => "Getting and Keeping Clients",
                        'title_ru' => "Получение и удержание клиентов",
                        'description_en' => "Marketing and client relationship strategies.",
                        'description_ru' => "Стратегии маркетинга и отношений с клиентами."
                    ],
                    [
                        'title_en' => "Taking Care of Yourself (So You Can Take Care of Others)",
                        'title_ru' => "Забота о себе (чтобы вы могли заботиться о других)",
                        'description_en' => "Self-care practices for sustainable massage therapy careers.",
                        'description_ru' => "Практики заботы о себе для устойчивой карьеры массажного терапевта."
                    ]
                ]
            ],
            [
                'title_en' => "Essential Oils Enhancement",
                'title_ru' => "Улучшение с эфирными маслами",
                'description_en' => "Enhance your massage practice with safe and effective essential oil use.",
                'description_ru' => "Улучшите свою массажную практику безопасным и эффективным использованием эфирных масел.",
                'lessons' => [
                    [
                        'title_en' => "Essential Oils - Making Good Massage Great",
                        'title_ru' => "Эфирные масла - превращаем хороший массаж в отличный",
                        'description_en' => "Introduction to essential oils in massage therapy.",
                        'description_ru' => "Введение в эфирные масла в массажной терапии."
                    ],
                    [
                        'title_en' => "Don't Poison Your Clients (Essential Oil Safety 101)",
                        'title_ru' => "Не отравите своих клиентов (безопасность эфирных масел 101)",
                        'description_en' => "Critical safety information for essential oil use.",
                        'description_ru' => "Критически важная информация о безопасности использования эфирных масел."
                    ],
                    [
                        'title_en' => "Making Magic Potions (Blending Basics)",
                        'title_ru' => "Создание волшебных зелий (основы смешивания)",
                        'description_en' => "Learn to create effective essential oil blends.",
                        'description_ru' => "Научитесь создавать эффективные смеси эфирных масел."
                    ],
                    [
                        'title_en' => "Using Them Like a Pro",
                        'title_ru' => "Используем их как профессионал",
                        'description_en' => "Professional application techniques for essential oils in massage.",
                        'description_ru' => "Профессиональные техники применения эфирных масел в массаже."
                    ]
                ]
            ],
            [
                'title_en' => "Special Situations and Advanced Stuff",
                'title_ru' => "Особые ситуации и продвинутые вещи",
                'description_en' => "Handle special populations and advanced massage scenarios confidently.",
                'description_ru' => "Уверенно работайте с особыми группами и продвинутыми сценариями массажа.",
                'lessons' => [
                    [
                        'title_en' => "Chair Massage (The Gateway Drug of Massage)",
                        'title_ru' => "Массаж в кресле (вводный наркотик массажа)",
                        'description_en' => "Learn effective chair massage techniques and business applications.",
                        'description_ru' => "Изучите эффективные техники массажа в кресле и бизнес-применения."
                    ],
                    [
                        'title_en' => "Special Populations (Not Everyone Is the Same)",
                        'title_ru' => "Особые группы (не все одинаковые)",
                        'description_en' => "Adapt techniques for elderly, pregnant, and other special populations.",
                        'description_ru' => "Адаптируйте техники для пожилых, беременных и других особых групп."
                    ],
                    [
                        'title_en' => "Common Problems and Solutions",
                        'title_ru' => "Распространенные проблемы и решения",
                        'description_en' => "Troubleshoot common massage therapy challenges.",
                        'description_ru' => "Решите распространенные проблемы массажной терапии."
                    ]
                ]
            ]
        ];

        // Create modules and lessons for both languages
        foreach (['en', 'ru'] as $language) {
            foreach ($moduleData as $moduleIndex => $moduleInfo) {
                $module = Module::create([
                    'title' => $language === 'en' ? $moduleInfo['title_en'] : $moduleInfo['title_ru'],
                    'description' => $language === 'en' ? $moduleInfo['description_en'] : $moduleInfo['description_ru'],
                    'language' => $language,
                    'order' => $moduleIndex + 1,
                    'duration_minutes' => 60, // Default duration
                    'learning_objectives' => [
                        $language === 'en' ? 'Complete module objectives' : 'Выполнить цели модуля'
                    ],
                    'is_published' => true
                ]);

                foreach ($moduleInfo['lessons'] as $lessonIndex => $lessonInfo) {
                    Lesson::create([
                        'module_id' => $module->id,
                        'title' => $language === 'en' ? $lessonInfo['title_en'] : $lessonInfo['title_ru'],
                        'description' => $language === 'en' ? $lessonInfo['description_en'] : $lessonInfo['description_ru'],
                        'content' => $language === 'en' ? 
                            'Detailed lesson content for: ' . $lessonInfo['title_en'] :
                            'Подробное содержание урока для: ' . $lessonInfo['title_ru'],
                        'language' => $language,
                        'video_url' => null,
                        'video_duration_seconds' => null,
                        'duration_minutes' => rand(10, 30),
                        'thumbnail' => 'lesson-thumb-' . ($moduleIndex + 1) . '-' . ($lessonIndex + 1) . '.jpg',
                        'order' => $lessonIndex + 1,
                        'is_published' => true,
                        'is_preview' => $lessonIndex === 0, // First lesson of each module is preview
                        'is_free' => false,
                        'reading_time_minutes' => rand(5, 15),
                        'quiz_questions' => []
                    ]);
                }
            }
        }

        $this->command->info('Massage course content seeded successfully!');
        $this->command->info('Created modules and lessons in both English and Russian.');
        $this->command->info('Total modules per language: ' . count($moduleData));
        $this->command->info('Total lessons per language: ' . collect($moduleData)->sum(fn($m) => count($m['lessons'])));
    }
}
