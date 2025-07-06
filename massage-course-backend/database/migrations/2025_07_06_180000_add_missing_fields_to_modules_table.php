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
        Schema::table('modules', function (Blueprint $table) {
            $table->integer('duration_minutes')->nullable()->after('description');
            $table->json('learning_objectives')->nullable()->after('duration_minutes');
            $table->renameColumn('sort_order', 'order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn(['duration_minutes', 'learning_objectives']);
            $table->renameColumn('order', 'sort_order');
        });
    }
};
