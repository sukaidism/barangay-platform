<?php

use App\Modules\Blotter\Controllers\BlotterController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('blotters', BlotterController::class)->names('blotter');
});

Route::middleware('api')->prefix('api')->name('api.')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
        Route::apiResource('blotters', BlotterController::class)->names('blotter');
    });
});
