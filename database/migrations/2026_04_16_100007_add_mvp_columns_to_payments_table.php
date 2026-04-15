<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('transaction_reference')
                ->nullable()
                ->comment('Null for legacy and non-digital records before transaction references were introduced.')
                ->after('id');

            $table->string('payment_method')
                ->default('cash')
                ->comment('Initial MVP methods: cash, stripe, other.')
                ->after('amount');

            $table->string('stripe_payment_intent_id')
                ->nullable()
                ->comment('Null for non-Stripe payments or unpaid records.')
                ->after('payment_method');

            $table->string('stripe_checkout_session_id')
                ->nullable()
                ->comment('Null for non-Stripe payments or unpaid records.')
                ->after('stripe_payment_intent_id');

            $table->unique('transaction_reference', 'payments_transaction_reference_unique');
            $table->index('payment_method', 'payments_payment_method_index');
            $table->index('stripe_payment_intent_id', 'payments_stripe_payment_intent_id_index');
            $table->index('stripe_checkout_session_id', 'payments_stripe_checkout_session_id_index');
            $table->index('status', 'payments_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('payments_status_index');
            $table->dropIndex('payments_stripe_checkout_session_id_index');
            $table->dropIndex('payments_stripe_payment_intent_id_index');
            $table->dropIndex('payments_payment_method_index');
            $table->dropUnique('payments_transaction_reference_unique');

            $table->dropColumn([
                'transaction_reference',
                'payment_method',
                'stripe_payment_intent_id',
                'stripe_checkout_session_id',
            ]);
        });
    }
};
