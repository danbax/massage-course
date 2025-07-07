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
        // Language column for users table already exists, only add to modules and lessons
        
        // Add language column to modules table
        Schema::table('modules', function (Blueprint $table) {
            $table->string('language', 10)->default('en')->after('title');
            $table->index('language');
        });

        // Add language column to lessons table
        Schema::table('lessons', function (Blueprint $table) {
            $table->string('language', 10)->default('en')->after('title');
            $table->index('language');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Only drop columns we added (not the users language column which existed)
        
        Schema::table('modules', function (Blueprint $table) {
            $table->dropIndex(['language']);
            $table->dropColumn('language');
        });

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropIndex(['language']);
            $table->dropColumn('language');
        });
    }
};
