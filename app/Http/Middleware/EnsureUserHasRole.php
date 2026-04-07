<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return response('Unauthorized', 401);
        }

        if (!$request->user()->hasAnyRole($roles)) {
            return response('Forbidden', 403);
        }

        return $next($request);
    }
}
