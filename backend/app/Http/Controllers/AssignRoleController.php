<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AssignRoleService;
use Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

        return response()->json($result);
    }




    public function temp(Request $request)
    {
        $user = User::where('role_id', 3)
           
            ->get();
            $user[0]->role_id=3;
            $user[0]->parent_id=null;
            $user[0]->save();
       

        return response()->json([
            $user[0]
        ]);
    }
}
