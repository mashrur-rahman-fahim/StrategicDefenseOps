<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UnassignRoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnassignRoleController extends Controller
{
    private UnassignRoleService $roleUnassignService;

    public function __construct(UnassignRoleService $roleUnassignService)
    {
        $this->roleUnassignService = $roleUnassignService;
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

        $manager = $this->roleUnassignService->unassignRole($request->managerEmail, 2, $parentId);

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
                $operator = $this->roleUnassignService->unassignRole($request->operatorEmail, 3, $manager->id);
            }
        } else {
            $operator = $this->roleUnassignService->unassignRole($request->operatorEmail, 3, $parentId);
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
                $viewer = $this->roleUnassignService->unassignRole($request->viewerEmail, 4, $manager->id);
            }
        } else {
            $viewer = $this->roleUnassignService->unassignRole($request->viewerEmail, 4, $parentId);
        }

        return isset($viewer) ? response()->json([$viewer]) 
                              : response()->json(['message' => 'Viewer not found or not assigned'], 404);
    }
}
