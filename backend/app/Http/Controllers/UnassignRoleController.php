<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UnassignRoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnassignRoleController extends Controller
{
    private UnassignRoleService $unassignRoleService;

    public function __construct(UnassignRoleService $unassignRoleService)
    {
        $this->unassignRoleService = $unassignRoleService;
    }

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

        return $manager ? response()->json([$manager]) 
                        : response()->json(['message' => 'Manager not found or not assigned'], 404);
    }

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

        return isset($operator) ? response()->json([$operator]) 
                                : response()->json(['message' => 'Operator not found or not assigned'], 404);
    }

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

        return isset($viewer) ? response()->json([$viewer]) 
                              : response()->json(['message' => 'Viewer not found or not assigned'], 404);
    }
}
