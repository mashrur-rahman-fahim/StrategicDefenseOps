<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogController extends Controller
{
    public function index(User $user)
    {
        // Authorization is handled by middleware
        $logs = AuditLog::where('user_id', $user->id)->latest()->get();

        return response()->json($logs);
    }
}
