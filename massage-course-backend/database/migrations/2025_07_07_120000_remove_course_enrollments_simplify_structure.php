<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove foreign key constraints first - check if they exist
        Schema::table('user_progress', function (Blueprint $table) {
            // Check if foreign key exists before dropping using raw SQL
            $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'user_progress' AND CONSTRAINT_NAME = 'user_progress_course_id_foreign'");
            if (!empty($foreignKeys)) {
                $table->dropForeign(['course_id']);
            }
        });

        Schema::table('lesson_progress', function (Blueprint $table) {
            $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'lesson_progress' AND CONSTRAINT_NAME = 'lesson_progress_lesson_id_foreign'");
            if (!empty($foreignKeys)) {
                $table->dropForeign(['lesson_id']);
            }
        });

        Schema::table('modules', function (Blueprint $table) {
            $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'modules' AND CONSTRAINT_NAME = 'modules_course_id_foreign'");
            if (!empty($foreignKeys)) {
                $table->dropForeign(['course_id']);
            }
        });

        Schema::table('lessons', function (Blueprint $table) {
            $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'lessons' AND CONSTRAINT_NAME = 'lessons_module_id_foreign'");
            if (!empty($foreignKeys)) {
                $table->dropForeign(['module_id']);
            }
        });

        // Remove course_id foreign key from certificates before dropping courses table
        Schema::table('certificates', function (Blueprint $table) {
            $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'certificates' AND CONSTRAINT_NAME = 'certificates_course_id_foreign'");
            if (!empty($foreignKeys)) {
                $table->dropForeign(['course_id']);
            }
        });

        // Remove course_id foreign key from user_certificates before dropping courses table  
        Schema::table('user_certificates', function (Blueprint $table) {
            $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'user_certificates' AND CONSTRAINT_NAME = 'user_certificates_course_id_foreign'");
            if (!empty($foreignKeys)) {
                $table->dropForeign(['course_id']);
            }
        });

        // Remove course_id foreign key from payments before dropping courses table  
        Schema::table('payments', function (Blueprint $table) {
            $foreignKeys = DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'payments' AND CONSTRAINT_NAME = 'payments_course_id_foreign'");
            if (!empty($foreignKeys)) {
                $table->dropForeign(['course_id']);
            }
        });

        // Drop course_enrollments table since we don't need it
        Schema::dropIfExists('course_enrollments');
        
        // Drop courses table since we only have one course
        Schema::dropIfExists('courses');
        
        // Remove course_id from user_progress since there's only one course
        Schema::table('user_progress', function (Blueprint $table) {
            if (Schema::hasColumn('user_progress', 'course_id')) {
                $table->dropColumn('course_id');
            }
        });

        // Remove course_id from modules since there's only one course
        Schema::table('modules', function (Blueprint $table) {
            if (Schema::hasColumn('modules', 'course_id')) {
                $table->dropColumn('course_id');
            }
        });

        // Payments table updates - remove course_id
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'course_id')) {
                $table->dropColumn('course_id');
            }
        });

        // Certificates table updates - remove course_id column (foreign key already dropped)
        Schema::table('certificates', function (Blueprint $table) {
            if (Schema::hasColumn('certificates', 'course_id')) {
                $table->dropColumn('course_id');
            }
        });

        Schema::table('user_certificates', function (Blueprint $table) {
            if (Schema::hasColumn('user_certificates', 'course_id')) {
                $table->dropColumn('course_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate courses table
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->boolean('is_free')->default(false);
            $table->integer('duration_hours')->default(0);
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->string('language', 5)->default('en');
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->text('what_you_will_learn')->nullable();
            $table->text('prerequisites')->nullable();
            $table->text('target_audience')->nullable();
            $table->integer('enrolled_students_count')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->integer('total_ratings')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->foreignId('instructor_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        // Recreate course_enrollments table
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->timestamp('enrolled_at');
            $table->timestamp('completed_at')->nullable();
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->timestamp('last_accessed_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'course_id']);
        });

        // Add back course_id columns
        Schema::table('user_progress', function (Blueprint $table) {
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
        });

        Schema::table('modules', function (Blueprint $table) {
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('course_id')->nullable()->constrained()->onDelete('set null');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
        });

        Schema::table('user_certificates', function (Blueprint $table) {
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
        });
    }
};
