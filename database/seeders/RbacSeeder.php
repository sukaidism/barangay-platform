<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RbacSeeder extends Seeder
{
    private const GUARD_NAME = 'web';

    /**
     * @return array<string>
     */
    private function permissions(): array
    {
        return [
            'residents.view-any',
            'residents.view',
            'residents.create',
            'residents.update',
            'residents.delete',
            'residents.verify',
            'residents.export',
            'households.view-any',
            'households.view',
            'households.create',
            'households.update',
            'households.delete',
            'document-requests.view-any',
            'document-requests.view',
            'document-requests.create',
            'document-requests.update',
            'document-requests.approve',
            'document-requests.reject',
            'document-requests.release',
            'document-requests.cancel',
            'blotters.view-any',
            'blotters.view',
            'blotters.create',
            'blotters.update',
            'blotters.resolve',
            'blotters.schedule-hearing',
            'assistance-programs.view-any',
            'assistance-programs.create',
            'assistance-programs.update',
            'assistance-programs.delete',
            'assistance-applications.view-any',
            'assistance-applications.view',
            'assistance-applications.create',
            'assistance-applications.approve',
            'assistance-applications.reject',
            'assistance-applications.disburse',
            'payments.view-any',
            'payments.view',
            'payments.create',
            'payments.refund',
            'payments.export',
            'users.manage',
            'roles.manage',
            'audit-logs.view',
            'officials.manage',
            'announcements.manage',
            'events.manage',
            'dashboard.admin',
            'dashboard.resident',
        ];
    }

    /**
     * @return array<string, string>
     */
    private function roles(): array
    {
        return [
            'admin' => 'Barangay Administrator',
            'staff' => 'Barangay Staff',
            'resident' => 'Barangay Resident',
        ];
    }

    /**
     * @return array<string, array<string>>
     */
    private function rolePermissionMap(): array
    {
        return [
            // Admin has full platform control.
            'admin' => $this->permissions(),
            'staff' => [
                'dashboard.admin',
                'residents.view-any',
                'residents.view',
                'residents.create',
                'residents.update',
                'residents.verify',
                'residents.export',
                'households.view-any',
                'households.view',
                'households.create',
                'households.update',
                'document-requests.view-any',
                'document-requests.view',
                'document-requests.create',
                'document-requests.update',
                'document-requests.approve',
                'document-requests.reject',
                'document-requests.release',
                'document-requests.cancel',
                'blotters.view-any',
                'blotters.view',
                'blotters.create',
                'blotters.update',
                'blotters.resolve',
                'blotters.schedule-hearing',
                'assistance-programs.view-any',
                'assistance-programs.update',
                'assistance-applications.view-any',
                'assistance-applications.view',
                'assistance-applications.create',
                'assistance-applications.approve',
                'assistance-applications.reject',
                'assistance-applications.disburse',
                'payments.view-any',
                'payments.view',
                'payments.create',
                'payments.export',
                'officials.manage',
                'announcements.manage',
                'events.manage',
            ],
            'resident' => [
                'dashboard.resident',
                'residents.view',
                'residents.create',
                'residents.update',
                'households.view',
                'document-requests.view',
                'document-requests.create',
                'document-requests.cancel',
                'blotters.view',
                'blotters.create',
                'assistance-programs.view-any',
                'assistance-applications.view',
                'assistance-applications.create',
                'payments.view',
                'payments.create',
            ],
        ];
    }

    public function run(): void
    {
        $now = now();

        foreach ($this->roles() as $name => $description) {
            DB::table('roles')->updateOrInsert(
                ['name' => $name],
                [
                    'description' => $description,
                    'guard_name' => self::GUARD_NAME,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        foreach ($this->permissions() as $permission) {
            DB::table('permissions')->updateOrInsert(
                [
                    'name' => $permission,
                    'guard_name' => self::GUARD_NAME,
                ],
                [
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        $roleIds = DB::table('roles')->pluck('id', 'name');
        $permissionIds = DB::table('permissions')->pluck('id', 'name');

        foreach ($this->rolePermissionMap() as $roleName => $permissions) {
            $roleId = $roleIds[$roleName] ?? null;

            if (!$roleId) {
                continue;
            }

            foreach ($permissions as $permissionName) {
                $permissionId = $permissionIds[$permissionName] ?? null;

                if (!$permissionId) {
                    continue;
                }

                DB::table('role_has_permissions')->updateOrInsert([
                    'permission_id' => $permissionId,
                    'role_id' => $roleId,
                ]);
            }
        }
    }
}
