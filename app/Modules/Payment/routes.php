<?php

use App\Modules\Payment\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('payments', PaymentController::class)->names('payment');
});

Route::middleware('api')->prefix('api')->name('api.')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
        Route::apiResource('payments', PaymentController::class)->names('payment');
    });
});
