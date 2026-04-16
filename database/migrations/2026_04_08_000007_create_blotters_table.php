<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blotters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complainant_id')->constrained('residents')->cascadeOnDelete();
            $table->foreignId('respondent_id')->nullable()->constrained('residents')->nullOnDelete();
            $table->string('incident_type');
            $table->text('narrative');
            $table->date('incident_date');
            $table->string('incident_location')->nullable();
            $table->enum('status', ['Filed', 'Under Investigation', 'Resolved', 'Dismissed'])->default('Filed');
            $table->text('resolution')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blotters');
    }
};
