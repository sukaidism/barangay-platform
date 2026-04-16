<?php

use App\Modules\ResidentPortal\Controllers\AnnouncementController;
use App\Modules\ResidentPortal\Controllers\BlotterController;
use App\Modules\ResidentPortal\Controllers\DashboardController;
use App\Modules\ResidentPortal\Controllers\DocumentRequestController;
use App\Modules\ResidentPortal\Controllers\EventController;
use App\Modules\ResidentPortal\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:resident'])->prefix('resident')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('resident-portal.dashboard');

    Route::get('/profile', [ProfileController::class, 'show'])->name('resident-portal.profile');
    Route::post('/profile', [ProfileController::class, 'store'])->name('resident-portal.profile.store');
    Route::post('/profile/submit', [ProfileController::class, 'submit'])->name('resident-portal.profile.submit');

    Route::get('/document-requests', [DocumentRequestController::class, 'index'])->name('resident-portal.document-requests.index');
    Route::get('/document-requests/create', [DocumentRequestController::class, 'create'])->name('resident-portal.document-requests.create');
    Route::post('/document-requests', [DocumentRequestController::class, 'store'])->name('resident-portal.document-requests.store');
    Route::get('/document-requests/{documentRequest}', [DocumentRequestController::class, 'show'])->name('resident-portal.document-requests.show');
    Route::delete('/document-requests/{documentRequest}', [DocumentRequestController::class, 'cancel'])->name('resident-portal.document-requests.cancel');

    Route::get('/blotters', [BlotterController::class, 'index'])->name('resident-portal.blotters.index');
    Route::get('/blotters/create', [BlotterController::class, 'create'])->name('resident-portal.blotters.create');
    Route::post('/blotters', [BlotterController::class, 'store'])->name('resident-portal.blotters.store');
    Route::get('/blotters/{blotter}', [BlotterController::class, 'show'])->name('resident-portal.blotters.show');

    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('resident-portal.announcements.index');
    Route::get('/announcements/{announcement}', [AnnouncementController::class, 'show'])->name('resident-portal.announcements.show');

    Route::get('/events', [EventController::class, 'index'])->name('resident-portal.events.index');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('resident-portal.events.show');
});
