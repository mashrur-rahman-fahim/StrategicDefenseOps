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
    public function __construct(AssignRoleService $assignRoleService){
        $this->assignRoleService = $assignRoleService;
    }
    public function managerAssign(Request $request): JsonResponse
    {
        $request->validate([
            'managerEmail' => 'required|email|exists:users,email',
        ]);
        $parentId = auth()->id();
       $result=$this->assignRoleService->managerAssign($request->managerEmail,$parentId);

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

        $result = $this->assignRoleService->operatorAssign($parentId,  $data['operatorEmail'],$data['managerEmail'] ?? null);
        
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

        $result = $this->assignRoleService->assignViewer($parentId,  $data['viewerEmail'],$data['managerEmail'] ?? null,);
        
        // Audit Log
        $assignedUser = User::where('email', $data['viewerEmail'])->first();
        $this->logActivity($parentId, $assignedUser, 'Viewer');

        return response()->json($result);
    }




    public function temp(Request $request)
    {
        $user = User::where('role_id',3)
           
            ->get();
        
       $user[0]->parent_id=11;
       $user[0]->save();
        
        return response()->json([
            $user
        ]);
    }
    private function logActivity($parentId, $assignedUser, $role)
    {
        if ($assignedUser) {
            Activity::causedBy(auth()->user()) // The parent assigning the role
                ->performedOn($assignedUser) // The user receiving the role
                ->withProperties([
                    'parent_id' => $parentId,
                    'user_email' => $assignedUser->email,
                    'assigned_role' => $role,
                ])
                ->log("Assigned role {$role} to user {$assignedUser->email} by {$parentId}");
        }
    }
}
