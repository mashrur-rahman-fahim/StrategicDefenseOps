<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UnassignRoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Facades\Activity;

class UnassignRoleController extends Controller
{
    private UnassignRoleService $unassignRoleService;

    public function __construct(UnassignRoleService $unassignRoleService)
    {
        $this->unassignRoleService = $unassignRoleService;
    }

    /* 
     * Function : managerUnassign
     * Description : Unassigns a manager role from a user by the parent (manager).
     * @param Request $request - The request object containing the manager's email.
     * @return JsonResponse - Returns a JSON response with the unassigned manager data or an error message.
     */
    public function managerUnassign(Request $request): JsonResponse
    {
        $request->validate([
            'managerEmail' => 'required|email|exists:users,email',
        ]);

        $parentId = auth()->id();
        $parent = User::find($parentId);

        if (!$parent || $parent->role_id !== 1) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $manager = $this->unassignRoleService->unassignRole($request->managerEmail, 2, $parentId);

        return $manager ? response()->json([$manager]) && $this->logActivity($parentId, $manager, 'Manager') //Audit Log
            : response()->json(['message' => 'Manager not found or not assigned'], 404);
    }

    /* 
     * Function : operatorUnassign
     * Description : Unassigns an operator role from a user by either a parent or a manager.
     * @param Request $request - The request object containing the operator's email.
     * @return JsonResponse - Returns a JSON response with the unassigned operator data or an error message.
     */
    public function operatorUnassign(Request $request): JsonResponse
    {
        $request->validate([
            'operatorEmail' => 'required|email|exists:users,email',
        ]);

        $parentId = auth()->id();
        $parent = User::find($parentId);

        if (!$parent) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($parent->role_id == 1) {
            $request->validate(['managerEmail' => 'required|email|exists:users,email']);
            $manager = User::where('email', $request->managerEmail)->where('role_id', 2)->where('parent_id', $parentId)->first();

            if ($manager) {
                $operator = $this->unassignRoleService->unassignRole($request->operatorEmail, 3, $manager->id);
                return response()->json([$operator], 200);
            }
        } else {
            $operator = $this->unassignRoleService->unassignRole($request->operatorEmail, 3, $parentId);
        }

        return isset($operator) ? response()->json([$operator]) &&  $this->logUnassignActivity($parentId, $operator, 'Operator') // Audit Log
            : response()->json(['message' => 'Operator not found or not assigned'], 404);
    }

    /* 
     * Function : viewerUnassign
     * Description : Unassigns a viewer role from a user by either a parent or a manager.
     * @param Request $request - The request object containing the viewer's email.
     * @return JsonResponse - Returns a JSON response with the unassigned viewer data or an error message.
     */
    public function viewerUnassign(Request $request): JsonResponse
    {
        $request->validate([
            'viewerEmail' => 'required|email|exists:users,email',
        ]);

        $parentId = auth()->id();
        $parent = User::find($parentId);

        if (!$parent) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($parent->role_id == 1) {
            $request->validate(['managerEmail' => 'required|email|exists:users,email']);
            $manager = User::where('email', $request->managerEmail)->where('role_id', 2)->where('parent_id', $parentId)->first();
            if ($manager) {
                $viewer = $this->unassignRoleService->unassignRole($request->viewerEmail, 4, $manager->id);
            }
        } else {
            $viewer = $this->unassignRoleService->unassignRole($request->viewerEmail, 4, $parentId);
        }

        return isset($viewer) ? response()->json([$viewer]) && $this->logUnassignActivity($parentId, $viewer, 'Viewer') // Audit Log
            : response()->json(['message' => 'Viewer not found or not assigned'], 404);
    }

    /* 
     * Function : logUnassignActivity
     * Description : Logs the activity of unassigning a role from a user.
     * @param int $parentId - The ID of the parent user performing the unassignment.
     * @param $unassignedUser - The user whose role is being unassigned.
     * @param string $role - The role being unassigned (e.g., Manager, Operator, Viewer).
     * @return void
     */
    private function logUnassignActivity($parentId, $unassignedUser, $role)
    {
        if ($unassignedUser) {
            activity()
                ->causedBy(auth()->user())
                ->performedOn($unassignedUser)
                ->tap(function ($activity) use ($parentId, $unassignedUser, $role) {
                    $activity->log_name = "role_unassignment";
                    $activity->user_id = auth()->user()->id;
                    $activity->user_name = auth()->user()->name;
                    $activity->user_email = auth()->user()->email;
                    $activity->description = "Unassigned role {$role} from user {$unassignedUser->email} by {$parentId}";
                    $activity->subject_type = get_class($unassignedUser);
                    $activity->subject_id = $unassignedUser->id;
                    $activity->causer_type = get_class(auth()->user());
                    $activity->causer_id = auth()->user()->id;
                })
                ->withProperties([
                    'parent_id' => $parentId,
                    'user_email' => $unassignedUser->email,
                    'unassigned_role' => $role,
                ])
                ->log("Unassigned role {$role} from user {$unassignedUser->email} by {$parentId}");
        }
    }
}
