<?php

use App\Modules\Household\Controllers\HouseholdController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('households', HouseholdController::class)->names('household');
});

Route::middleware('api')->prefix('api')->name('api.')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
        Route::apiResource('households', HouseholdController::class)->names('household');
    });
});
