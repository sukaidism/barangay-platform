<?php

namespace Tests\Feature\Architecture;

use Closure;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ResidentPortalRouteArchitectureTest extends TestCase
{
    public function test_resident_portal_announcement_and_event_routes_use_controllers(): void
    {
        foreach ([
            'resident-portal.announcements.index',
            'resident-portal.announcements.show',
            'resident-portal.events.index',
            'resident-portal.events.show',
        ] as $routeName) {
            $route = Route::getRoutes()->getByName($routeName);

            $this->assertNotNull($route, "Route [{$routeName}] is missing.");

            $uses = $route->getAction('uses');

            $this->assertIsString($uses, "Route [{$routeName}] must use a controller action string.");
            $this->assertNotInstanceOf(Closure::class, $uses, "Route [{$routeName}] must not use an inline closure.");
            $this->assertStringStartsWith(
                'App\\Modules\\ResidentPortal\\Controllers\\',
                $uses,
                "Route [{$routeName}] must use app/Modules ResidentPortal controllers."
            );
        }
    }
}
