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

        if (!$logUser) {
            return response()->json(['error' => 'User not found (AuditLogAccess).'], 404);
        }

        // Check if the authenticated user can access the log
        if ($this->canAccessLogs($user, $logUser)) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }

    /**
     * Determine if the authenticated user can access the logs of the given user.
     *
     * @param  User  $user
     * @param  User  $logUser
     * @return bool
     */
    protected function canAccessLogs(User $user, User $logUser): bool
    {
        switch ($user->role_id) {
            case 1: // Admin
                // Admin can access their own logs and logs of users they are responsible for
                return $logUser->id === $user->id ||
                    $logUser->parent_id === $user->id ||
                    $this->isDescendant($user, $logUser);

            case 2: // Manager
                // Manager can access their own logs and logs of their direct subordinates
                return $logUser->id === $user->id ||
                    $logUser->parent_id === $user->id;

            case 3: // Operator
            case 4: // Viewer
                // Operators and Viewers can only access their own logs
                return $logUser->id === $user->id;

            default:
                return false;
        }
    }


    /**
     * Check if the given logUser is a descendant of the authenticated user in the hierarchy.
     *
     * @param  User  $user
     * @param  User  $logUser
     * @return bool
     */
    protected function isDescendant(User $user, User $logUser): bool
    {
        // Use a loop to traverse the hierarchy upwards
        $currentUser = $logUser;
        while ($currentUser->parent_id) {
            $currentUser = User::find($currentUser->parent_id);
            if ($currentUser && $currentUser->id === $user->id) {
                return true;
            }
        }

        return false;
    }
}
