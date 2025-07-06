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
            $table->string('avatar')->nullable()->after('email');
            $table->string('phone')->nullable()->after('avatar');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->string('profession')->nullable()->after('date_of_birth');
            $table->text('bio')->nullable()->after('profession');
            $table->boolean('is_admin')->default(false)->after('bio');
            $table->timestamp('last_login_at')->nullable()->after('is_admin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar',
                'phone',
                'date_of_birth',
                'profession',
                'bio',
                'is_admin',
                'last_login_at'
            ]);
        });
    }
};
