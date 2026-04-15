<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assistance_applications', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->foreignId('program_id')->constrained('assistance_programs')->cascadeOnDelete();
            $table->foreignId('resident_id')->constrained('residents')->cascadeOnDelete();
            $table->text('reason');
            $table->json('supporting_documents')->nullable()->comment('Null when no attachments are submitted.');
            $table->string('status')->default('pending')->index();
            $table->text('review_notes')->nullable()->comment('Null until an application review is performed.');
            $table->foreignId('reviewed_by')
                ->nullable()
                ->comment('Null until reviewed by staff/admin.')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('reviewed_at')
                ->nullable()
                ->comment('Null until reviewed by staff/admin.');
            $table->decimal('disbursed_amount', 12, 2)
                ->nullable()
                ->comment('Null until disbursement is completed.');
            $table->timestamp('disbursed_at')
                ->nullable()
                ->comment('Null until disbursement is completed.');
            $table->timestamps();

            $table->index(['program_id', 'status'], 'assistance_applications_program_status_index');
            $table->index(['resident_id', 'status'], 'assistance_applications_resident_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('assistance_applications', function (Blueprint $table) {
            $table->dropIndex('assistance_applications_resident_status_index');
            $table->dropIndex('assistance_applications_program_status_index');
        });

        Schema::dropIfExists('assistance_applications');
    }
};
