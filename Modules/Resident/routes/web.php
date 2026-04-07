<?php

use Illuminate\Support\Facades\Route;
use Modules\Resident\Http\Controllers\ResidentController;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('residents', ResidentController::class)->names('resident');
    Route::get('residents-verification', [ResidentController::class, 'verification'])->name('resident.verification');
    Route::post('residents/{resident}/verify', [ResidentController::class, 'processVerification'])->name('resident.verify');
});
