<?php

use App\Modules\Event\Controllers\EventController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('events', EventController::class)->names('event');
});

Route::middleware('api')->prefix('api')->name('api.')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
        Route::apiResource('events', EventController::class)->names('event');
    });
});
