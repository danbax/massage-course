<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');
        
        $this->call([
            UserSeeder::class,
            MassageCourseContentSeeder::class,
            UserProgressSeeder::class,
            PaymentSeeder::class,
        ]);
        
        $this->command->info('🎉 Database seeding completed successfully!');
        $this->command->info('📊 You can now log in with:');
        $this->command->info('   Email: admin@massagecourse.com');
        $this->command->info('   Password: password');
    }
}