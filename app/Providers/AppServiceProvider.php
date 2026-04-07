<?php

namespace App\Providers;

use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Fix: pass Windows environment variables required for socket binding
        // in artisan serve subprocess (Herd + Windows compatibility)
        ServeCommand::$passthroughVariables = array_merge(
            ServeCommand::$passthroughVariables,
            ['LOCALAPPDATA', 'APPDATA', 'TEMP', 'TMP', 'USERPROFILE', 'HOMEPATH', 'HOMEDRIVE', 'COMPUTERNAME', 'USERNAME'],
        );
    }
}
