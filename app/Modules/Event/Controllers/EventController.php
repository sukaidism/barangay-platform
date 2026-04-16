<?php

namespace App\Modules\Event\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Modules\Event\Models\Event;
use App\Modules\Event\Requests\StoreEventRequest;
use App\Modules\Event\Requests\UpdateEventRequest;

class EventController extends Controller
{
    public function index(): Response
    {
        $events = Event::with('creator')
            ->latest()
            ->paginate(15);

        return Inertia::render('Event/Index', [
            'events' => $events,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Event/Create');
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        Event::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('event.index')
            ->with('success', 'Event created successfully.');
    }

    public function show(Event $event): Response
    {
        $event->load('creator');

        return Inertia::render('Event/Show', [
            'event' => $event,
        ]);
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('Event/Edit', [
            'event' => $event,
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $event->update($request->validated());

        return redirect()->route('event.index')
            ->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return redirect()->route('event.index')
            ->with('success', 'Event deleted successfully.');
    }
}
