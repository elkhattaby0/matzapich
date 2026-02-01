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
            $table->text('bio')->nullable();
            $table->string('socialStatus')->nullable();
            $table->string('from')->nullable();
            $table->string('livesIn')->nullable();
            $table->string('work')->nullable();
            $table->string('studied')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bio', 'socialStatus', 'from', 'livesIn', 'work', 'studied']);
            });
        
    }
};
