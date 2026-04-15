<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_requests', function (Blueprint $table) {
            $table->string('reference_number')
                ->nullable()
                ->comment('Null for legacy rows created before reference sequencing was introduced.')
                ->after('id');

            $table->foreignId('document_type_id')
                ->nullable()
                ->comment('Null while legacy rows still use the document_type text column during transition.')
                ->after('document_type')
                ->constrained('document_types')
                ->nullOnDelete();

            $table->foreignId('processed_by')
                ->nullable()
                ->comment('Null until a staff member processes the request.')
                ->after('fee')
                ->constrained('users')
                ->nullOnDelete();

            $table->unique('reference_number', 'document_requests_reference_number_unique');
            $table->index('status', 'document_requests_status_index');
            $table->index(['resident_id', 'status'], 'document_requests_resident_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('document_requests', function (Blueprint $table) {
            $table->dropIndex('document_requests_resident_status_index');
            $table->dropIndex('document_requests_status_index');
            $table->dropUnique('document_requests_reference_number_unique');

            $table->dropForeign(['processed_by']);
            $table->dropForeign(['document_type_id']);
            $table->dropColumn(['reference_number', 'document_type_id', 'processed_by']);
        });
    }
};
