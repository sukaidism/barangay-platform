<?php

namespace App\Modules\Announcement\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Announcement\Models\Announcement;
use App\Modules\Announcement\Requests\StoreAnnouncementRequest;
use App\Modules\Announcement\Requests\UpdateAnnouncementRequest;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::with('author')
            ->latest()
            ->paginate(15);

        return Inertia::render('Announcement/Index', [
            'announcements' => $announcements,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Announcement/Create');
    }

    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        Announcement::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('announcement.index')
            ->with('success', 'Announcement created successfully.');
    }

    public function show(Announcement $announcement): Response
    {
        $announcement->load('author');

        return Inertia::render('Announcement/Show', [
            'announcement' => $announcement,
        ]);
    }

    public function edit(Announcement $announcement): Response
    {
        return Inertia::render('Announcement/Edit', [
            'announcement' => $announcement,
        ]);
    }

    public function update(UpdateAnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $announcement->update($request->validated());

        return redirect()->route('announcement.index')
            ->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();

        return redirect()->route('announcement.index')
            ->with('success', 'Announcement deleted successfully.');
    }
}
