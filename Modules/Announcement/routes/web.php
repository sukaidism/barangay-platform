<?php

use Illuminate\Support\Facades\Route;
use Modules\Announcement\Http\Controllers\AnnouncementController;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('announcements', AnnouncementController::class)->names('announcement');
});
