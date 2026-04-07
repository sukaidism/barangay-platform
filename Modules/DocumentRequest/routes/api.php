<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentRequest\Http\Controllers\DocumentRequestController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('documentrequests', DocumentRequestController::class)->names('documentrequest');
});
