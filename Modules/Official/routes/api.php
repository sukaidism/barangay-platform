<?php

use Illuminate\Support\Facades\Route;
use Modules\Official\Http\Controllers\OfficialController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('officials', OfficialController::class)->names('official');
});
