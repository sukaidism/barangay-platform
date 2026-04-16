<?php

namespace Tests\Feature\Architecture;

use Tests\TestCase;

class ModulePathArchitectureTest extends TestCase
{
    public function test_internal_app_modules_path_is_canonical(): void
    {
        $this->assertTrue(
            is_dir(base_path('app/Modules')),
            'app/Modules must exist as the canonical module location.'
        );

        $this->assertFalse(
            is_dir(base_path('Modules')),
            'Root Modules directory must not be used anymore.'
        );
    }

    public function test_modules_do_not_keep_package_style_scaffolding_files(): void
    {
        $modules = glob(base_path('app/Modules/*'), GLOB_ONLYDIR) ?: [];

        foreach ($modules as $modulePath) {
            $this->assertFileDoesNotExist($modulePath.'/composer.json', 'Module-level composer.json must be removed.');
            $this->assertFileDoesNotExist($modulePath.'/package.json', 'Module-level package.json must be removed.');
            $this->assertFileDoesNotExist($modulePath.'/vite.config.js', 'Module-level vite.config.js must be removed.');
            $this->assertFileDoesNotExist($modulePath.'/module.json', 'Module plugin metadata (module.json) must be removed.');

            $this->assertDirectoryDoesNotExist($modulePath.'/app/Providers', 'Module-level providers folder must be removed unless truly required.');
        }
    }
}
