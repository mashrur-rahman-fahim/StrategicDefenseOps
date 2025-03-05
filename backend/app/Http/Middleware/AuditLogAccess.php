<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditLogAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        $logUser = User::find($request->route('user'));

        if (! $logUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check if the authenticated user is an admin or the assigned admin
        if ($user->is_admin || $user->id === $logUser->admin_id) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
