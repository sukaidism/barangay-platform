<?php

use App\Modules\Resident\Controllers\ResidentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('residents', ResidentController::class)->names('resident');
    Route::get('residents-verification', [ResidentController::class, 'verification'])->name('resident.verification');
    Route::post('residents/{resident}/verify', [ResidentController::class, 'processVerification'])->name('resident.verify');
});

Route::middleware('api')->prefix('api')->name('api.')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
        Route::apiResource('residents', ResidentController::class)->names('resident');
    });
});
