<?php

use Illuminate\Support\Facades\Route;
use Modules\Blotter\Http\Controllers\BlotterController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('blotters', BlotterController::class)->names('blotter');
});
