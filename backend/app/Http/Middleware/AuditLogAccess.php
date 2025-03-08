<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


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

        // Fetch activity logs based on the authenticated user's role and hierarchy
        $logs = $this->getActivityLogs($user);

        // Proceed if the middleware passes
        return $next($request);
    }

    /**
     * Fetch activity logs for Admin or Manager based on the hierarchy
     *
     * @param User $user
     * @return \Illuminate\Support\Collection
     */
    public function getActivityLogs(User $user)
    {
        if ($user->role_id == 1) {
            // Admin can view their own logs, and logs of their subordinates (Managers, Operators, Viewers)
            return DB::select('
                SELECT * 
                FROM activity_log 
                WHERE user_id = ? 
                UNION
                SELECT * 
                FROM activity_log 
                WHERE user_id IN (
                    SELECT id 
                    FROM users 
                    WHERE parent_id = ?
                    UNION
                    SELECT id 
                    FROM users 
                    WHERE parent_id IN (
                        SELECT id 
                        FROM users 
                        WHERE parent_id = ?
                    )
                )
            ', [$user->id, $user->id, $user->id]);
        } elseif ($user->role_id == 2) {

        } else {

        }
    }
}