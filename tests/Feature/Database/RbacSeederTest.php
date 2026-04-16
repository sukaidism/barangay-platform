<?php

namespace Tests\Feature\Database;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RbacSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_rbac_seeders_create_permissions_roles_and_admin_account(): void
    {
        $this->seed(RbacSeeder::class);
        $this->seed(AdminUserSeeder::class);

        $this->assertDatabaseHas('roles', [
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $this->assertDatabaseHas('permissions', [
            'name' => 'users.manage',
            'guard_name' => 'web',
        ]);

        $this->assertDatabaseHas('permissions', [
            'name' => 'document-requests.approve',
            'guard_name' => 'web',
        ]);

        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');
        $permissionCount = DB::table('permissions')->count();
        $adminPermissionCount = DB::table('role_has_permissions')->where('role_id', $adminRoleId)->count();

        $this->assertSame($permissionCount, $adminPermissionCount);

        $admin = User::query()->where('email', AdminUserSeeder::ADMIN_EMAIL)->first();

        $this->assertNotNull($admin);
        $this->assertTrue(Hash::check(AdminUserSeeder::DEFAULT_ADMIN_PASSWORD, $admin->password));

        $this->assertDatabaseHas('model_has_roles', [
            'role_id' => $adminRoleId,
            'model_type' => User::class,
            'model_id' => $admin->id,
        ]);

        $this->assertTrue($admin->hasRole('admin'));
    }
}
