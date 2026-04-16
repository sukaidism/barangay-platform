<?php

namespace App\Modules\ResidentPortal\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Event\Models\Event;

class EventController extends Controller
{
    public function index(): Response
    {
        $events = Event::query()
            ->latest('starts_at')
            ->paginate(15);

        return Inertia::render('ResidentPortal/Event/Index', [
            'events' => $events,
        ]);
    }

    public function show(Event $event): Response
    {
        $event->load('creator');

        return Inertia::render('ResidentPortal/Event/Show', [
            'event' => $event,
        ]);
    }
}
