<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index($id)
    {
        $user = Auth::user();
        $logUser = User::find($id);

        if (!$logUser) {
            return response()->json(['error' => 'User not found AuditLog.'], 404);
        }

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
            return DB::select(
                'SELECT * FROM activity_log WHERE user_id = ? AND log_name LIKE \'Operation%\' ',
                [$user->id]
            );
        } elseif ($user->role_id == 2) {
            return DB::select(
                'SELECT * FROM activity_log 
             WHERE user_id = (
                 SELECT parent_id
                 FROM users 
                 WHERE id = ?
             ) 
             AND log_name LIKE \'Operation%\'',
                [$user->id]
            );
        } else {
            return DB::select(
                'SELECT * 
             FROM activity_log 
             WHERE user_id IN ( 
                 SELECT parent_id 
                 FROM users 
                 WHERE id IN (
                     SELECT parent_id 
                     FROM users 
                     WHERE id =?
                 )
             ) 
             AND log_name LIKE \'Operation%\'',
                [$user->id]
            );
        }
    }
}
