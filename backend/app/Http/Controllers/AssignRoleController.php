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


    /**
     * Function : managerAssign
     * Description : This function assigns the "Manager" role to a user.
     * @param Request $request - The request containing the manager's email.
     * @return JsonResponse - The response containing the result of role assignment.
     */
    public function managerAssign(Request $request): JsonResponse
    {
        $request->validate([
            'managerEmail' => 'required|email|exists:users,email',
        ]);
        $parentId = auth()->id();
        $result = $this->assignRoleService->managerAssign($request->managerEmail, $parentId);

        // Audit Log 
        $status = $result ? 'success' : 'failed';
        $assignedUser = User::where('email', $request->managerEmail)->first();
        $this->logActivity($parentId, $assignedUser, 'Manager', $status);

        return response()->json($result);
    }


    /**
     * Function : operatorAssign
     * Description : This function assigns the "Operator" role to a user and optionally assigns a manager to the operator.
     * @param Request $request - The request containing the operator's email and optional manager's email.
     * @return JsonResponse - The response containing the result of role assignment.
     */
    public function operatorAssign(Request $request): JsonResponse
    {
        $parentId = auth()->id();
        $data = $request->validate([
            'operatorEmail' => 'required|email|exists:users,email',
            'managerEmail' => 'nullable|email|exists:users,email'
        ]);

        $result = $this->assignRoleService->operatorAssign($parentId,  $data['operatorEmail'], $data['managerEmail'] ?? null);

        // Audit Log
        $status = $result ? 'success' : 'failed';
        $assignedUser = User::where('email', $data['operatorEmail'])->first();
        $this->logActivity($parentId, $assignedUser, 'Operator', $status);

        return response()->json($result);
    }


    /**
     * Function : viewerAssign
     * Description : This function assigns the "Viewer" role to a user and optionally assigns a manager to the viewer.
     * @param Request $request - The request containing the viewer's email and optional manager's email.
     * @return JsonResponse - The response containing the result of role assignment.
     */
    public function viewerAssign(Request $request): JsonResponse
    {
        $parentId = auth()->id();
        $data = $request->validate([
            'viewerEmail' => 'required|email|exists:users,email',
            'managerEmail' => 'nullable|email|exists:users,email'
        ]);

        $result = $this->assignRoleService->assignViewer($parentId,  $data['viewerEmail'], $data['managerEmail'] ?? null,);

        // Audit Log
        $status = $result ? 'success' : 'failed';
        $assignedUser = User::where('email', $data['viewerEmail'])->first();
        $this->logActivity($parentId, $assignedUser, 'Viewer', $status);

        return response()->json($result);
    }



    /** 
     * Function : temp
     * Description : Temporary function to assign a parent ID to a user with role_id 3.
     * @param Request $request - The request object.
     * @return JsonResponse - The response with the updated user data.
     */
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


    /** 
     * Function : logActivity
     * Description : Logs the role assignment activity to the database.
     * @param int $parentId - The ID of the parent user.
     * @param User|null $assignedUser - The user to whom the role was assigned.
     * @param string $role - The role being assigned.
     * @param string $status - The status of the assignment ('success' or 'failed').
     * @param string|null $errorMessage - The error message in case of failure.
     * @return void
     */
    private function logActivity($parentId, $assignedUser, $role, $status, $errorMessage = null)
    {
        if ($assignedUser) {
            Activity::create([
                'log_name'      => 'role_assignment',
                'user_id'       => auth()->id(),
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
                'user_id'       => auth()->id(),  
                'user_name'     => auth()->user()->name ?? 'Unknown',
                'user_email'    => auth()->user()->email ?? 'Unknown',
                'description'   => "Failed to assign role {$role} to a non-existent user.",
                'subject_type'  => 'App\Models\User',
                'subject_id'    => null,
                'causer_type'   => 'App\Models\User',
                'causer_id'     => auth()->id(),
                'properties'    => json_encode([
                    'assigned_user_name'  => 'N/A',
                    'assigned_user_email' => 'N/A',
                    'assigned_role'       => $role,
                    'parent_id'           => $parentId,
                    'timestamp'           => now()->toDateTimeString(),
                    'status'              => 'failed',
                    'error_message'       => $errorMessage ?? 'Assigned user not found'
                ])
            ]);
        }
    }
}
