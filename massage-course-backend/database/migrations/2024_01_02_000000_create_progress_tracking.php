<?php
// 2024_01_02_000000_create_progress_tracking.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('completed_lessons')->nullable();
            $table->integer('total_lessons')->nullable();
            $table->decimal('progress_percentage', 5, 2)->nullable();
            // Changed from foreignId to unsignedInteger and removed constraint
            // since lessons table has composite primary key
            $table->unsignedInteger('last_lesson_id')->nullable();
            $table->integer('time_spent_minutes')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique('user_id');
            $table->index('progress_percentage');
            $table->index('completed_at');
            $table->index('last_lesson_id'); // Add index for performance
        });

        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            // Changed from foreignId to unsignedInteger and removed constraint
            // since lessons table has composite primary key
            $table->unsignedInteger('lesson_id')->nullable();
            $table->integer('watch_time_seconds')->nullable();
            $table->decimal('watch_percentage', 5, 2)->nullable();
            $table->boolean('is_completed')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->decimal('quiz_score', 5, 2)->nullable();
            $table->integer('quiz_attempts')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);
            $table->index('is_completed');
            $table->index('completed_at');
            $table->index('lesson_id'); // Add index for performance
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('user_progress');
    }
};