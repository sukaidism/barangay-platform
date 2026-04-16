<?php

use App\Modules\DocumentRequest\Controllers\DocumentRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('documentrequests', DocumentRequestController::class)->names('documentrequest');
});

Route::middleware('api')->prefix('api')->name('api.')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
        Route::apiResource('documentrequests', DocumentRequestController::class)->names('documentrequest');
    });
});
