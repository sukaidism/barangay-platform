<?php

namespace App\Modules\ResidentPortal\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Announcement\Models\Announcement;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::query()
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->paginate(15);

        return Inertia::render('ResidentPortal/Announcement/Index', [
            'announcements' => $announcements,
        ]);
    }

    public function show(Announcement $announcement): Response
    {
        if (!$announcement->published_at || $announcement->published_at->isFuture()) {
            abort(404);
        }

        $announcement->load('author');

        return Inertia::render('ResidentPortal/Announcement/Show', [
            'announcement' => $announcement,
        ]);
    }
}
