<?php

use Illuminate\Support\Facades\Route;
use Modules\Event\Http\Controllers\EventController;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('events', EventController::class)->names('event');
});
