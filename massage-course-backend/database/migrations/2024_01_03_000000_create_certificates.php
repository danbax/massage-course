<?php
// 2024_01_03_000000_create_certificates.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->longText('template_content')->nullable();
            $table->string('background_image')->nullable();
            $table->boolean('is_active')->nullable();
            $table->timestamps();
        });

        Schema::create('user_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('certificate_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('certificate_number')->nullable()->unique();
            $table->timestamp('issued_at')->nullable();
            $table->string('file_path')->nullable();
            $table->string('verification_code', 20)->nullable()->unique();
            $table->timestamps();

            $table->unique('user_id');
            $table->index('certificate_number');
            $table->index('verification_code');
            $table->index('issued_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_certificates');
        Schema::dropIfExists('certificates');
    }
};