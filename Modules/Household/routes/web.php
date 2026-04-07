<?php

use Illuminate\Support\Facades\Route;
use Modules\Household\Http\Controllers\HouseholdController;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('households', HouseholdController::class)->names('household');
});
