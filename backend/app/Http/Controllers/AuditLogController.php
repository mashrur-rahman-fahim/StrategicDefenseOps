<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuditLogController extends Controller
{
    public function index($id)
    {
        // Retrieve the authenticated user
        $user = Auth::user();

        // Retrieve the user by id (the one whose logs are being requested)
        $logUser = User::find($id);

        if (!$logUser) {
            return response()->json(['error' => 'User not found AuditLog.'], 404);
        }

        // Check if the user can access the logs of the logUser
        // Fetch the logs based on the user's role and hierarchy
        $logs = $this->getActivityLogs($user);

        return response()->json($logs);
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
            // Manager can view their own logs, and logs of their direct subordinates (Operators, Viewers)
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
                )
            ', [$user->id, $user->id]);
        } else {
            // Operator or Viewer can only view their own logs
            return DB::select('
                SELECT * 
                FROM activity_log 
                WHERE user_id = ?
            ', [$user->id]);
        }
    }
}
