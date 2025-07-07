<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing modules
        Module::truncate();
        
        $modules = [
            // ENGLISH MODULES
            [
                'title' => "Let's Get This Party Started",
                'language' => 'en',
                'description' => 'Get excited about your massage journey! Learn what makes you awesome at this and discover why this course will transform your skills.',
                'order' => 1,
                'duration_minutes' => 45,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'The Stuff That Really, REALLY Matters',
                'language' => 'en', 
                'description' => 'Essential equipment, setup, and professional standards that will make or break your massage practice.',
                'order' => 2,
                'duration_minutes' => 180,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Body Basics (The Non-Boring Version)',
                'language' => 'en',
                'description' => 'Anatomy and physiology fundamentals every massage therapist needs to know.',
                'order' => 3,
                'duration_minutes' => 140,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Techniques That Actually Work',
                'language' => 'en',
                'description' => 'Master the core massage techniques that form the foundation of effective therapy.',
                'order' => 4,
                'duration_minutes' => 150,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'The Full Body Massage Sequence (The Main Event!)',
                'language' => 'en',
                'description' => 'Step-by-step complete body massage sequence from start to finish.',
                'order' => 5,
                'duration_minutes' => 200,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Business and Career Development',
                'language' => 'en',
                'description' => 'Build and grow your successful massage therapy practice.',
                'order' => 6,
                'duration_minutes' => 90,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Essential Oils Enhancement',
                'language' => 'en',
                'description' => 'Enhance your massage practice with safe and effective essential oil use.',
                'order' => 7,
                'duration_minutes' => 80,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Special Situations and Advanced Stuff',
                'language' => 'en',
                'description' => 'Advanced techniques and special populations for experienced therapists.',
                'order' => 8,
                'duration_minutes' => 75,
                'is_published' => true,
                'course_id' => 1,
            ],
            
            // RUSSIAN MODULES
            [
                'title' => 'Давайте начнем эту вечеринку',
                'language' => 'ru',
                'description' => 'Получите удовольствие от вашего массажного путешествия! Узнайте, что делает вас потрясающими в этом деле и почему этот курс изменит ваши навыки.',
                'order' => 1,
                'duration_minutes' => 45,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'То, что ДЕЙСТВИТЕЛЬНО, ОЧЕНЬ важно',
                'language' => 'ru',
                'description' => 'Необходимое оборудование, установка и профессиональные стандарты, которые могут сделать или сломать вашу массажную практику.',
                'order' => 2,
                'duration_minutes' => 180,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Основы тела (не скучная версия)',
                'language' => 'ru',
                'description' => 'Основы анатомии и физиологии, которые должен знать каждый массажист.',
                'order' => 3,
                'duration_minutes' => 140,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Техники, которые действительно работают',
                'language' => 'ru',
                'description' => 'Освойте основные техники массажа, которые составляют основу эффективной терапии.',
                'order' => 4,
                'duration_minutes' => 150,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Последовательность массажа всего тела (главное событие!)',
                'language' => 'ru',
                'description' => 'Пошаговая последовательность массажа всего тела от начала до конца.',
                'order' => 5,
                'duration_minutes' => 200,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Развитие бизнеса и карьеры',
                'language' => 'ru',
                'description' => 'Создайте и развивайте свою успешную практику массажной терапии.',
                'order' => 6,
                'duration_minutes' => 90,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Улучшение эфирными маслами',
                'language' => 'ru',
                'description' => 'Улучшите свою массажную практику безопасным и эффективным использованием эфирных масел.',
                'order' => 7,
                'duration_minutes' => 80,
                'is_published' => true,
                'course_id' => 1,
            ],
            [
                'title' => 'Особые ситуации и продвинутые техники',
                'language' => 'ru',
                'description' => 'Продвинутые техники и особые группы населения для опытных терапевтов.',
                'order' => 8,
                'duration_minutes' => 75,
                'is_published' => true,
                'course_id' => 1,
            ],
        ];

        foreach ($modules as $moduleData) {
            Module::create($moduleData);
        }

        $this->command->info('Created modules for single course system in English and Russian');
    }
}
