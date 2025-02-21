<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AssignRoleService;
use Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Facades\Activity;

class AssignRoleController extends Controller
{
    protected AssignRoleService $assignRoleService;
    public function __construct(AssignRoleService $assignRoleService)
    {
        $this->assignRoleService = $assignRoleService;
    }
    public function managerAssign(Request $request): JsonResponse
    {
        $request->validate([
            'managerEmail' => 'required|email|exists:users,email',
        ]);
        $parentId = auth()->id();
        $result = $this->assignRoleService->managerAssign($request->managerEmail, $parentId);

        // Audit Log 
        $assignedUser = User::where('email', $request->managerEmail)->first();
        $this->logActivity($parentId, $assignedUser, 'Manager');

        return response()->json($result);
    }
    public function operatorAssign(Request $request): JsonResponse
    {
        $parentId = auth()->id();
        $data = $request->validate([
            'operatorEmail' => 'required|email|exists:users,email',
            'managerEmail' => 'nullable|email|exists:users,email'
        ]);

        $result = $this->assignRoleService->operatorAssign($parentId,  $data['operatorEmail'], $data['managerEmail'] ?? null);

        // Audit Log
        $assignedUser = User::where('email', $data['operatorEmail'])->first();
        $this->logActivity($parentId, $assignedUser, 'Operator');

        return response()->json($result);
    }


    public function viewerAssign(Request $request): JsonResponse
    {
        $parentId = auth()->id();
        $data = $request->validate([
            'viewerEmail' => 'required|email|exists:users,email',
            'managerEmail' => 'nullable|email|exists:users,email'
        ]);

        $result = $this->assignRoleService->assignViewer($parentId,  $data['viewerEmail'], $data['managerEmail'] ?? null,);

        // Audit Log
        $assignedUser = User::where('email', $data['viewerEmail'])->first();
        $this->logActivity($parentId, $assignedUser, 'Viewer');

        return response()->json($result);
    }




    public function temp(Request $request)
    {
        $user = User::where('role_id', 3)

            ->get();

        $user[0]->parent_id = 11;
        $user[0]->save();

        return response()->json([
            $user
        ]);
    }
    private function logActivity($parentId, $assignedUser, $role, $status = 'success', $errorMessage = null)
    {
        if ($assignedUser) {
            Activity::create([
                'log_name'      => 'role_assignment',
                'user_name'     => auth()->user()->name ?? 'Unknown',
                'user_email'    => auth()->user()->email ?? 'Unknown',
                'description'   => $status === 'success'
                    ? "Successfully assigned role {$role} to user {$assignedUser->email}."
                    : "Failed to assign role {$role} to user {$assignedUser->email}.",
                'subject_type'  => 'App\Models\User',
                'subject_id'    => $assignedUser->id,
                'causer_type'   => 'App\Models\User',
                'causer_id'     => auth()->id(),
                'properties'    => json_encode([
                    'assigned_user_name'  => $assignedUser->name ?? 'N/A',
                    'assigned_user_email' => $assignedUser->email ?? 'N/A',
                    'assigned_role'       => $role,
                    'parent_id'           => $parentId,
                    'timestamp'           => now()->toDateTimeString(),
                    'status'              => $status,
                    'error_message'       => $status === 'failed' ? $errorMessage : null
                ])
            ]);
        } else {
            Activity::create([
                'log_name'      => 'role_assignment',
                'user_name'     => auth()->user()->name ?? 'Unknown',
                'user_email'    => auth()->user()->email ?? 'Unknown',
                'description'   => $status === 'success'
                    ? "Successfully assigned role {$role} to user {$assignedUser->email}."
                    : "Failed to assign role {$role} to user {$assignedUser->email}.",
                'subject_type'  => 'App\Models\User',
                'subject_id'    => $assignedUser->id ?? null,
                'causer_type'   => 'App\Models\User',
                'causer_id'     => auth()->id(),
                'properties'    => json_encode([
                    'assigned_user_name'  => $assignedUser->name ?? 'N/A',
                    'assigned_user_email' => $assignedUser->email ?? 'N/A',
                    'assigned_role'       => $role,
                    'parent_id'           => $parentId,
                    'timestamp'           => now()->toDateTimeString(),
                    'status'              => $status,
                    'error_message'       => $status === 'failed' ? $errorMessage : null
                ])
            ]);
        }
    }
}
