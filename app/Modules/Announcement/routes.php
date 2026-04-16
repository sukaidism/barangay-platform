<?php

use App\Modules\Announcement\Controllers\AnnouncementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('announcements', AnnouncementController::class)->names('announcement');
});

Route::middleware('api')->prefix('api')->name('api.')->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
        Route::apiResource('announcements', AnnouncementController::class)->names('announcement');
    });
});
