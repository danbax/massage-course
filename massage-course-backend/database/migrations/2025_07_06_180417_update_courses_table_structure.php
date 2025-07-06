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
        Schema::table('courses', function (Blueprint $table) {
            // Drop columns that don't match the expected structure
            $table->dropColumn([
                'thumbnail',
                'instructor_name',
                'instructor_bio', 
                'instructor_avatar',
                'prerequisites',
                'is_featured',
                'published_at',
                'meta_title',
                'meta_description',
                'sort_order'
            ]);
        });

        Schema::table('courses', function (Blueprint $table) {
            // Add missing columns
            $table->text('short_description')->nullable()->after('description');
            $table->foreignId('instructor_id')->nullable()->constrained('users')->after('short_description');
            $table->string('currency', 3)->default('USD')->after('price');
            $table->string('language', 5)->default('en')->after('difficulty_level');
            $table->string('category')->nullable()->after('language');
            $table->boolean('featured')->default(false)->after('is_published');
            $table->string('thumbnail_url')->nullable()->after('featured');
            $table->string('preview_video_url')->nullable()->after('thumbnail_url');
            $table->json('requirements')->nullable()->after('learning_objectives');
            $table->json('tags')->nullable()->after('requirements');
            $table->string('estimated_completion_time')->nullable()->after('tags');
            $table->boolean('certification_available')->default(false)->after('estimated_completion_time');
            $table->decimal('rating_average', 3, 1)->default(0)->after('certification_available');
            $table->integer('rating_count')->default(0)->after('rating_average');
            $table->integer('enrollment_count')->default(0)->after('rating_count');
            $table->timestamp('last_updated')->nullable()->after('enrollment_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Add back the dropped columns
            $table->string('thumbnail')->nullable();
            $table->string('instructor_name');
            $table->text('instructor_bio')->nullable();
            $table->string('instructor_avatar')->nullable();
            $table->json('prerequisites')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->integer('sort_order')->default(0);
        });

        Schema::table('courses', function (Blueprint $table) {
            // Drop the added columns
            $table->dropColumn([
                'short_description',
                'instructor_id',
                'currency',
                'language',
                'category',
                'featured',
                'thumbnail_url',
                'preview_video_url',
                'requirements',
                'tags',
                'estimated_completion_time',
                'certification_available',
                'rating_average',
                'rating_count',
                'enrollment_count',
                'last_updated'
            ]);
        });
    }
};
