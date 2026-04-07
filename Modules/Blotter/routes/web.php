<?php

use Illuminate\Support\Facades\Route;
use Modules\Blotter\Http\Controllers\BlotterController;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('blotters', BlotterController::class)->names('blotter');
});
