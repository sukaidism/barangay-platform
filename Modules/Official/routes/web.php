<?php

use Illuminate\Support\Facades\Route;
use Modules\Official\Http\Controllers\OfficialController;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('officials', OfficialController::class)->names('official');
});
