<?php

namespace Tests\Feature\Architecture;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AnnouncementModuleStructureTest extends TestCase
{
    public function test_announcement_routes_use_flat_app_modules_controller_namespace(): void
    {
        $route = Route::getRoutes()->getByName('announcement.index');

        $this->assertNotNull($route, 'Route [announcement.index] is missing.');

        $uses = $route->getAction('uses');

        $this->assertIsString($uses);
        $this->assertStringStartsWith(
            'App\\Modules\\Announcement\\Controllers\\',
            $uses,
            'Announcement routes must resolve to App\\Modules\\Announcement\\Controllers namespace.'
        );

        $this->assertFileExists(
            base_path('app/Modules/Announcement/Controllers/AnnouncementController.php'),
            'Flat module controller file is missing.'
        );

        $this->assertDirectoryDoesNotExist(
            base_path('app/Modules/Announcement/app/Http'),
            'Nested app/Http folder should not exist in flat module structure.'
        );
    }
}
