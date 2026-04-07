<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained()->cascadeOnDelete();
            $table->string('document_type');
            $table->text('purpose');
            $table->enum('status', ['Pending', 'Under Review', 'Approved', 'Released', 'Rejected'])->default('Pending');
            $table->text('remarks')->nullable();
            $table->string('or_number')->nullable();
            $table->decimal('fee', 10, 2)->default(0);
            $table->timestamp('released_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
