<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->enum('status', ['draft', 'pending_verification', 'active', 'rejected', 'inactive'])
                ->default('draft')
                ->after('is_active');
            $table->text('verification_notes')->nullable()->after('status');
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete()->after('verification_notes');
            $table->timestamp('verified_at')->nullable()->after('verified_by');
        });
    }

    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->dropForeign(['verified_by']);
            $table->dropColumn(['status', 'verification_notes', 'verified_by', 'verified_at']);
        });
    }
};
