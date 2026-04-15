<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blotters', function (Blueprint $table) {
            $table->string('case_number')
                ->nullable()
                ->comment('Null for legacy rows that predate case numbering.')
                ->after('id');

            $table->string('respondent_name')
                ->nullable()
                ->comment('Null when respondent is an existing resident linked by respondent_id.')
                ->after('respondent_id');

            $table->foreignId('recorded_by')
                ->nullable()
                ->comment('Null for legacy rows where recorder user was not captured.')
                ->after('resolution')
                ->constrained('users')
                ->nullOnDelete();

            $table->unique('case_number', 'blotters_case_number_unique');
            $table->index('status', 'blotters_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('blotters', function (Blueprint $table) {
            $table->dropIndex('blotters_status_index');
            $table->dropUnique('blotters_case_number_unique');
            $table->dropForeign(['recorded_by']);
            $table->dropColumn(['case_number', 'respondent_name', 'recorded_by']);
        });
    }
};
