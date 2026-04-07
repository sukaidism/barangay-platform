<?php

use App\Http\Controllers\ResidentPortal\ResidentBlotterController;
use App\Http\Controllers\ResidentPortal\ResidentDashboardController;
use App\Http\Controllers\ResidentPortal\ResidentDocumentRequestController;
use App\Http\Controllers\ResidentPortal\ResidentProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:resident'])->prefix('resident')->group(function () {
    // Dashboard
    Route::get('/dashboard', ResidentDashboardController::class)->name('resident-portal.dashboard');

    // Profile / Self-registration
    Route::get('/profile', [ResidentProfileController::class, 'show'])->name('resident-portal.profile');
    Route::post('/profile', [ResidentProfileController::class, 'store'])->name('resident-portal.profile.store');
    Route::post('/profile/submit', [ResidentProfileController::class, 'submit'])->name('resident-portal.profile.submit');

    // Document Requests
    Route::get('/document-requests', [ResidentDocumentRequestController::class, 'index'])->name('resident-portal.document-requests.index');
    Route::get('/document-requests/create', [ResidentDocumentRequestController::class, 'create'])->name('resident-portal.document-requests.create');
    Route::post('/document-requests', [ResidentDocumentRequestController::class, 'store'])->name('resident-portal.document-requests.store');
    Route::get('/document-requests/{documentRequest}', [ResidentDocumentRequestController::class, 'show'])->name('resident-portal.document-requests.show');
    Route::delete('/document-requests/{documentRequest}', [ResidentDocumentRequestController::class, 'cancel'])->name('resident-portal.document-requests.cancel');

    // Blotters
    Route::get('/blotters', [ResidentBlotterController::class, 'index'])->name('resident-portal.blotters.index');
    Route::get('/blotters/create', [ResidentBlotterController::class, 'create'])->name('resident-portal.blotters.create');
    Route::post('/blotters', [ResidentBlotterController::class, 'store'])->name('resident-portal.blotters.store');
    Route::get('/blotters/{blotter}', [ResidentBlotterController::class, 'show'])->name('resident-portal.blotters.show');

    // Announcements (read-only, reuse public data)
    Route::get('/announcements', function () {
        $announcements = \Modules\Announcement\Models\Announcement::query()
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->paginate(15);

        return \Inertia\Inertia::render('ResidentPortal/Announcement/Index', [
            'announcements' => $announcements,
        ]);
    })->name('resident-portal.announcements.index');

    Route::get('/announcements/{announcement}', function (\Modules\Announcement\Models\Announcement $announcement) {
        if (!$announcement->published_at || $announcement->published_at->isFuture()) {
            abort(404);
        }
        $announcement->load('author');

        return \Inertia\Inertia::render('ResidentPortal/Announcement/Show', [
            'announcement' => $announcement,
        ]);
    })->name('resident-portal.announcements.show');

    // Events (read-only)
    Route::get('/events', function () {
        $events = \Modules\Event\Models\Event::query()
            ->latest('starts_at')
            ->paginate(15);

        return \Inertia\Inertia::render('ResidentPortal/Event/Index', [
            'events' => $events,
        ]);
    })->name('resident-portal.events.index');

    Route::get('/events/{event}', function (\Modules\Event\Models\Event $event) {
        $event->load('creator');

        return \Inertia\Inertia::render('ResidentPortal/Event/Show', [
            'event' => $event,
        ]);
    })->name('resident-portal.events.show');
});
