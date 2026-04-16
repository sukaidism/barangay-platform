<?php

use Illuminate\Support\Facades\Route;

// Central API route entrypoint. Feature module API routes are loaded from bootstrap/app.php.
Route::middleware('api')->group(function () {
    // Intentionally empty: modules register API routes in app/Modules/*/routes.php
});
