<?php

namespace App\Http\Controllers\ResidentPortal;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ResidentDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = auth()->user();
        $resident = $user->resident;

        $data = [
            'hasProfile' => (bool) $resident,
            'profileStatus' => $resident?->status,
        ];

        if ($resident && $resident->status === 'active') {
            $data['recentRequests'] = $resident->documentRequests()
                ->latest()
                ->limit(5)
                ->get();
            $data['recentPayments'] = $resident->payments()
                ->latest()
                ->limit(5)
                ->get();
        }

        $data['announcements'] = \Modules\Announcement\Models\Announcement::query()
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->limit(5)
            ->get(['id', 'title', 'category', 'published_at', 'is_pinned']);

        $data['upcomingEvents'] = \Modules\Event\Models\Event::query()
            ->whereIn('status', ['Upcoming', 'Ongoing'])
            ->orderBy('starts_at')
            ->limit(5)
            ->get(['id', 'title', 'location', 'starts_at', 'ends_at', 'status']);

        return Inertia::render('ResidentPortal/Dashboard', $data);
    }
}
