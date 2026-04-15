<?php

namespace Tests\Feature\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class MvpSchemaMigrationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_mvp_schema_tables_and_columns_exist(): void
    {
        $this->assertTrue(Schema::hasTable('document_types'));
        $this->assertTrue(Schema::hasTable('blotter_hearings'));
        $this->assertTrue(Schema::hasTable('assistance_programs'));
        $this->assertTrue(Schema::hasTable('assistance_applications'));

        $this->assertTrue(
            Schema::hasColumns('document_requests', [
                'reference_number',
                'document_type_id',
                'processed_by',
            ])
        );

        $this->assertTrue(
            Schema::hasColumns('blotters', [
                'case_number',
                'respondent_name',
                'recorded_by',
            ])
        );

        $this->assertTrue(
            Schema::hasColumns('payments', [
                'transaction_reference',
                'payment_method',
                'stripe_payment_intent_id',
                'stripe_checkout_session_id',
            ])
        );
    }

    public function test_core_auth_and_notification_tables_exist(): void
    {
        $this->assertTrue(Schema::hasTable('notifications'));
        $this->assertTrue(Schema::hasTable('permissions'));
        $this->assertTrue(Schema::hasTable('model_has_roles'));
        $this->assertTrue(Schema::hasTable('model_has_permissions'));
        $this->assertTrue(Schema::hasTable('role_has_permissions'));

        $this->assertTrue(
            Schema::hasColumns('roles', [
                'name',
                'guard_name',
            ])
        );
    }
}
