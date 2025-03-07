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
        // Retrieve the authenticated user
        $user = Auth::user();

        // Retrieve the user associated with the provided ID from the route parameter
        $logUser = User::find($request->route('id'));

        if (! $logUser) {
            return response()->json(['error' => 'User not found (AuditLogAccess).'], 404);
        }

        // Check if the authenticated user is an admin or assigned admin for the log user
        if ($user->role_id==1 || $user->id === $logUser->admin_id) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
