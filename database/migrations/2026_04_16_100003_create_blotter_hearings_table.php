<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blotter_hearings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blotter_id')->constrained('blotters')->cascadeOnDelete();
            $table->dateTime('scheduled_at')->index();
            $table->string('venue');
            $table->text('notes')->nullable()->comment('Null until hearing notes are recorded by staff.');
            $table->string('outcome')->default('pending')->index();
            $table->foreignId('presided_by')
                ->nullable()
                ->comment('Null until a presiding official is assigned.')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blotter_hearings');
    }
};
