<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogController extends Controller
{
    public function index($id)
    {
        // Retrieve the user by id
        $user = User::find($id);

        if (! $user) {
            return response()->json(['error' => 'User not found AuditLog.'], 404);
        }

        // Fetch the audit logs for the user
        $logs = AuditLog::where('user_id', $user->id)->latest()->get();

        return response()->json($logs);
    }
}
