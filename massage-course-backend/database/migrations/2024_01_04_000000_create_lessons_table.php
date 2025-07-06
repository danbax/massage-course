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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('video_duration_seconds')->default(0);
            $table->integer('duration_minutes')->default(0);
            $table->string('thumbnail')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->boolean('is_preview')->default(false);
            $table->json('resources')->nullable(); // downloadable files, links, etc.
            $table->json('quiz_questions')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['module_id', 'sort_order']);
            $table->index('is_preview');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
