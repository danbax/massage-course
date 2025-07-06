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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('student')->after('is_admin');
            $table->string('timezone')->nullable()->after('role');
            $table->string('language')->default('en')->after('timezone');
            $table->string('country')->nullable()->after('language');
            $table->string('city')->nullable()->after('country');
            $table->enum('experience_level', ['beginner', 'intermediate', 'professional'])->default('beginner')->after('profession');
            $table->boolean('marketing_consent')->default(false)->after('experience_level');
            $table->boolean('newsletter_subscription')->default(false)->after('marketing_consent');
            $table->json('notification_preferences')->nullable()->after('newsletter_subscription');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'timezone',
                'language',
                'country',
                'city',
                'experience_level',
                'marketing_consent',
                'newsletter_subscription',
                'notification_preferences'
            ]);
        });
    }
};
