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
        Schema::create('user_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('certificate_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('certificate_number')->unique();
            $table->timestamp('issued_at')->useCurrent();
            $table->string('file_path')->nullable(); // Path to generated PDF
            $table->string('verification_code', 20)->unique();
            $table->timestamps();

            $table->index(['user_id', 'course_id']);
            $table->index('certificate_number');
            $table->index('verification_code');
            $table->index('issued_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_certificates');
    }
};
