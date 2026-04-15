<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assistance_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable()->comment('Null when the program has no long-form description.');
            $table->string('program_type')->index();
            $table->decimal('budget', 12, 2)->nullable()->comment('Null when no fixed budget is assigned yet.');
            $table->decimal('amount_per_beneficiary', 12, 2)->nullable()->comment('Null when support amount is case-by-case.');
            $table->unsignedInteger('max_beneficiaries')->nullable()->comment('Null when enrollment cap is not enforced.');
            $table->date('application_start')->nullable()->comment('Null when applications are not date-bounded.');
            $table->date('application_end')->nullable()->comment('Null when applications have no closing date.');
            $table->string('status')->default('draft')->index();
            $table->json('eligibility_criteria')->nullable()->comment('Null when eligibility is handled manually.');
            $table->foreignId('created_by')
                ->nullable()
                ->comment('Null for seeded/system-created program definitions.')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assistance_programs');
    }
};
