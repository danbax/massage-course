<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->json('learning_objectives')->nullable();
            $table->integer('order')->nullable();
            $table->boolean('is_published')->nullable();
            $table->string('language')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('order');
            $table->index(['language', 'order']);
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->integer('id');
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('language');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('video_duration')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->string('thumbnail')->nullable();
            $table->integer('order')->nullable();
            $table->boolean('is_published')->nullable();
            $table->boolean('is_free')->nullable();
            $table->boolean('has_quiz')->nullable();
            $table->json('resources')->nullable();
            $table->json('quiz_questions')->nullable();
            $table->json('learning_objectives')->nullable();
            $table->integer('estimated_duration')->nullable();
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced'])->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->primary(['id', 'module_id', 'language']);
            $table->index(['module_id', 'language', 'order']);
            $table->index('is_free');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('modules');
    }
};