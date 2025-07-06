<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->renameColumn('sort_order', 'order');
            $table->renameColumn('is_preview', 'is_free');
            $table->renameColumn('video_duration_seconds', 'video_duration');
            $table->boolean('has_quiz')->default(false)->after('is_free');
            $table->json('learning_objectives')->nullable()->after('resources');
            $table->integer('estimated_duration')->nullable()->after('learning_objectives');
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced'])->default('beginner')->after('estimated_duration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->renameColumn('order', 'sort_order');
            $table->renameColumn('is_free', 'is_preview');
            $table->renameColumn('video_duration', 'video_duration_seconds');
            $table->dropColumn(['has_quiz', 'learning_objectives', 'estimated_duration', 'difficulty_level']);
        });
    }
};
