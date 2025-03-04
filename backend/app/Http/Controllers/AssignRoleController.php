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
        // $this->logActivity($parentId, $assignedUser, 'Manager', $status);
    
        if(!$result){
            return response()->json(['message' => 'Failed to assign manager'], 422);
        }
        return response()->json(['message' => "Assign to manager"],200);
    }
    
    public function operatorAssign(Request $request): JsonResponse
    {
        $parentId = auth()->id();
        $data = $request->validate([
            'operatorEmail' => 'required|email|exists:users,email',
            'managerEmail' => 'nullable|email|exists:users,email',
        ]);
    
        $result = $this->assignRoleService->operatorAssign($parentId, $data['operatorEmail'], $data['managerEmail'] ?? null);
    
        // Audit Log
        $status = $result ? 'success' : 'failed';
        $assignedUser = User::where('email', $data['operatorEmail'])->first();
        // $this->logActivity($parentId, $assignedUser, 'Operator', $status);
    
        if(!$result){
            return response()->json(['message' => 'Failed to assign operator'], 422);
        }
        return response()->json(['message' => "Assign to operator"],200);
    }
    
    public function viewerAssign(Request $request): JsonResponse
    {
        $parentId = auth()->id();
        $data = $request->validate([
            'viewerEmail' => 'required|email|exists:users,email',
            'managerEmail' => 'nullable|email|exists:users,email',
        ]);
    
        $result = $this->assignRoleService->assignViewer($parentId, $data['viewerEmail'], $data['managerEmail'] ?? null);
    
        // Audit Log
        $status = $result ? 'success' : 'failed';
        $assignedUser = User::where('email', $data['viewerEmail'])->first();
        // $this->logActivity($parentId, $assignedUser, 'Viewer', $status);
    
        if(!$result){
            return response()->json(['message' => 'Failed to assign viewer'], 422);
        }
        return response()->json(['message' => "Assign to viewer"],200);
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
    private function logActivity($parentId, ?User $assignedUser, string $role, $status, $errorMessage = null)
    {

        $user = auth()->user();
        /* $assignedUserName = $assignedUser?->name ?? 'N/A'; 
        $assignedUserEmail = $assignedUser?->email ?? 'N/A'; */
        $activityDetails = [
            'log_name'    => 'role_assignment',
            'user_id'     => $user->id,
            'user_name'   => $user->name ?? 'Unknown',
            'user_email'  => $user->email ?? 'Unknown',
            'description' => $status === 'success'
                ? "Successfully assigned role {$role} to user {$assignedUser->email}."
                : "Failed to assign role {$role} to user {$assignedUser->email}.",
            'subject_type' => 'App\Models\User',
            'causer_type' => 'App\Models\User',
            'causer_id'   => $user->id,
            'properties'  => json_encode([
                'assigned_user_name'  => $assignedUser->name ?? 'N/A',
                'assigned_user_email' => $assignedUser->email ?? 'N/A',
                'assigned_role'       => $role,
                'parent_id'           => $parentId,
                'timestamp'           => now()->toDateTimeString(),
                'status'              => $status,
                'error_message'       => $status === 'failed' ? $errorMessage : null
            ])
        ];

        if ($assignedUser) {
            // Log for successful assignment
            activity()
                ->causedBy($user)
                ->performedOn($assignedUser)
                ->tap(function ($activity) use ($activityDetails) {
                    $activity->log_name = $activityDetails['log_name'];
                    $activity->user_id = $activityDetails['user_id'];
                    $activity->user_name = $activityDetails['user_name'];
                    $activity->user_email = $activityDetails['user_email'];
                    $activity->description = $activityDetails['description'];
                    $activity->subject_type = $activityDetails['subject_type'];
                    $activity->subject_id = $activityDetails['subject_id'];
                    $activity->causer_type = $activityDetails['causer_type'];
                    $activity->causer_id = $activityDetails['causer_id'];
                    $activity->properties = $activityDetails['properties'];
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'assigned_user_name' => $assignedUser->name ?? 'N/A',
                    'assigned_user_email' => $assignedUser->email ?? 'N/A',
                    'assigned_role' => $role,
                    'parent_id' => $parentId,
                    'status' => $status,
                    'error_message' => $status === 'failed' ? $errorMessage : null,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log("Role assignment {$status} for {$assignedUser->email}");
        } else {

            // Log for failed assignment (user not found)
            activity()
                ->causedBy($user)
                ->tap(function ($activity) use ($activityDetails) {
                    $activity->log_name = $activityDetails['log_name'];
                    $activity->user_id = $activityDetails['user_id'];
                    $activity->user_name = $activityDetails['user_name'];
                    $activity->user_email = $activityDetails['user_email'];
                    $activity->description = "Failed to assign role {$activityDetails['assigned_role']} to a non-existent user.";
                    $activity->subject_type = $activityDetails['subject_type'];
                    $activity->subject_id = null;
                    $activity->causer_type = $activityDetails['causer_type'];
                    $activity->causer_id = $activityDetails['causer_id'];
                    $activity->properties = $activityDetails['properties'];
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'assigned_user_name' => 'N/A',
                    'assigned_user_email' => 'N/A',
                    'assigned_role' => $role,
                    'parent_id' => $parentId,
                    'status' => 'failed',
                    'error_message' => $errorMessage ?? 'Assigned user not found',
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log("Failed role assignment for non-existent user");
        }
    }
}
