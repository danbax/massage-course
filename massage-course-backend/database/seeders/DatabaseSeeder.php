<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');
        
        // Seed in order of dependencies
        $this->call([
            UserSeeder::class,
            MassageCourseContentSeeder::class, // Add our specific course content
            CourseSeeder::class,
            ModuleSeeder::class,
            LessonSeeder::class,
            CertificateSeeder::class,
            EnrollmentSeeder::class,
        ]);
        
        $this->command->info('🎉 Database seeding completed successfully!');
        $this->command->info('📊 You can now log in with:');
        $this->command->info('   Email: admin@massagecourse.com');
        $this->command->info('   Password: password');
    }
}
