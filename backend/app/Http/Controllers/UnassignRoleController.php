<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
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
    
        // Check if the parent is authorized (must be a role_id 1 user)
        if (!$parent || $parent->role_id !== 1) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        DB::beginTransaction();
        try {
            $manager = $this->unassignRoleService->unassignRole($request->managerEmail, 2, $parentId);
    
            if (!$manager) {
                DB::rollBack();
                return response()->json(['message' => 'Manager not found or not assigned'], 404);
            }
    
            DB::commit();
            return response()->json(['manager' => $manager]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error unassigning manager role: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while unassigning the manager role'], 500);
        }
    }
    
    public function operatorUnassign(Request $request): JsonResponse
    {
        $request->validate([
            'operatorEmail' => 'required|email|exists:users,email',
        ]);
    
        $parentId = auth()->id();
        $parent = User::find($parentId);
    
        // Check if the parent is authorized
        if (!$parent) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        DB::beginTransaction();
        try {
            if ($parent->role_id == 1) {
                $request->validate(['managerEmail' => 'required|email|exists:users,email']);
                $manager = User::where('email', $request->managerEmail)
                    ->where('role_id', 2)
                    ->where('parent_id', $parentId)
                    ->first();
    
                if (!$manager) {
                    DB::rollBack();
                    return response()->json(['message' => 'Manager not found or not authorized'], 404);
                }
    
                $operator = $this->unassignRoleService->unassignRole($request->operatorEmail, 3, $manager->id);
            } else {
                $operator = $this->unassignRoleService->unassignRole($request->operatorEmail, 3, $parentId);
            }
    
            if (!$operator) {
                DB::rollBack();
                return response()->json(['message' => 'Operator not found or not assigned'], 404);
            }
    
            DB::commit();
            return response()->json(['operator' => $operator]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error unassigning operator role: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while unassigning the operator role'], 500);
        }
    }
    
    public function viewerUnassign(Request $request): JsonResponse
    {
        $request->validate([
            'viewerEmail' => 'required|email|exists:users,email',
        ]);
    
        $parentId = auth()->id();
        $parent = User::find($parentId);
    
        // Check if the parent is authorized
        if (!$parent) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        DB::beginTransaction();
        try {
            if ($parent->role_id == 1) {
                $request->validate(['managerEmail' => 'required|email|exists:users,email']);
                $manager = User::where('email', $request->managerEmail)
                    ->where('role_id', 2)
                    ->where('parent_id', $parentId)
                    ->first();
    
                if (!$manager) {
                    DB::rollBack();
                    return response()->json(['message' => 'Manager not found or not authorized'], 404);
                }
    
                $viewer = $this->unassignRoleService->unassignRole($request->viewerEmail, 4, $manager->id);
            } else {
                $viewer = $this->unassignRoleService->unassignRole($request->viewerEmail, 4, $parentId);
            }
    
            if (!$viewer) {
                DB::rollBack();
                return response()->json(['message' => 'Viewer not found or not assigned'], 404);
            }
    
            DB::commit();
            return response()->json(['viewer' => $viewer]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error unassigning viewer role: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while unassigning the viewer role'], 500);
        }
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
