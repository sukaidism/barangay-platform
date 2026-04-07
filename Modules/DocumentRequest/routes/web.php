<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentRequest\Http\Controllers\DocumentRequestController;

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('documentrequests', DocumentRequestController::class)->names('documentrequest');
});
