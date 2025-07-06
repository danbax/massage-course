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
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_provider')->nullable()->after('payment_method');
            $table->string('provider_transaction_id')->nullable()->after('payment_provider');
            $table->json('payment_data')->nullable()->after('provider_transaction_id');
            $table->renameColumn('metadata', 'old_metadata');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['payment_provider', 'provider_transaction_id', 'payment_data']);
            $table->renameColumn('old_metadata', 'metadata');
        });
    }
};
