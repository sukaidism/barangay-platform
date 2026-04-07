<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->foreignId('head_id')->nullable()->constrained('residents')->nullOnDelete();
            $table->string('household_number')->unique();
            $table->text('address');
            $table->string('purok')->nullable();
            $table->timestamps();
        });

        Schema::table('residents', function (Blueprint $table) {
            $table->foreignId('household_id')->nullable()->after('purok')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('household_id');
        });
        Schema::dropIfExists('households');
    }
};
