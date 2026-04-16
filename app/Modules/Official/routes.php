<?php

use App\Modules\Official\Controllers\OfficialController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('officials', OfficialController::class)->names('official');
});

Route::middleware('api')->prefix('api')->name('api.')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
        Route::apiResource('officials', OfficialController::class)->names('official');
    });
});
