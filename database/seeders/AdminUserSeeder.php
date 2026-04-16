<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public const ADMIN_NAME = 'System Administrator';
    public const ADMIN_EMAIL = 'admin@barangay.local';
    public const DEFAULT_ADMIN_PASSWORD = 'Admin@12345';

    public function run(): void
    {
        $now = now();

        $admin = User::query()->updateOrCreate(
            ['email' => self::ADMIN_EMAIL],
            [
                'name' => self::ADMIN_NAME,
                'email_verified_at' => $now,
                // Uses the User model hashed cast for secure storage.
                'password' => env('SEED_ADMIN_PASSWORD', self::DEFAULT_ADMIN_PASSWORD),
            ]
        );

        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');

        if (!$adminRoleId) {
            throw new RuntimeException('Admin role does not exist. Run RbacSeeder first.');
        }

        if (Schema::hasTable('role_user')) {
            DB::table('role_user')->updateOrInsert(
                [
                    'user_id' => $admin->id,
                    'role_id' => $adminRoleId,
                ],
                [
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        if (Schema::hasTable('model_has_roles')) {
            DB::table('model_has_roles')->updateOrInsert([
                'role_id' => $adminRoleId,
                'model_type' => User::class,
                'model_id' => $admin->id,
            ]);
        }
    }
}
