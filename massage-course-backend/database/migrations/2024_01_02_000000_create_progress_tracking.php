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
            $table->foreignId('last_lesson_id')->nullable()->constrained('lessons')->onDelete('set null');
            $table->integer('time_spent_minutes')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique('user_id');
            $table->index('progress_percentage');
            $table->index('completed_at');
        });

        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('lesson_id')->nullable()->constrained()->onDelete('cascade');
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
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('user_progress');
    }
};