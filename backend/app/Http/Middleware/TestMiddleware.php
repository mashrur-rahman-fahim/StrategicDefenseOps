<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TestMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->input('token')) {
            return response()->json([
                'error' => 'Unauthorized access',
                'message' => 'Message from TestMiddleware. You need to provide a token',
            ], 401);
        }

        return $next($request);
    }
}
