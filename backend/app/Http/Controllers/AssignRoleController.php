<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssignRoleController extends Controller
{
    //
    public function managerAssign(Request $request): JsonResponse
    {
        $request->validate([
            'managerEmail' => 'required|email|exists:users,email',
        ]);
        $parentId = auth()->id();
        $parent = User::find($parentId);
        $managerEmail = $request->get('managerEmail');
        $manager = User::where('email', $managerEmail)->where('role_id', 2)->where('parent_id', null)->first();
        if ($manager && $parentId && $parent->role_id == 1) {
            $manager->parent_id = $parentId;
            $manager->save();
            return response()->json([
                $manager,
                $managerEmail,
                $parentId,

            ]);
        }
        return response()->json([
            'message' => 'Not assigned to role',
            $parent
        ]);


    }
    public function opertaorAssign(Request $request)
    {
        $parentId = auth()->id();
        $parent = User::find($parentId);
        if ($parent && $parent->role_id == 1) {
            $request->validate([
                'managerEmail' => 'required|email|exists:users,email',
                'operatorEmail' => 'required|email|exists:users,email'
            ]);

            $managerEmail = $request->get('managerEmail');
            $operatorEmail = $request->get('operatorEmail');
            $manager = User::where('email', $managerEmail)
                ->where('role_id', 2)->where('parent_id', $parentId)->first();
            $operator = User::where('email', $operatorEmail)->where('role_id', 3)->where('parent_id', null)->first();
            if ($manager && $operator) {
                $operator->parent_id = $manager->parent_id;
                $operator->save();
                return response()->json([
                    $operator,
                    $manager,
                    $parent



                ]);
            }
            return response()->json([
                'message' => 'Not assigned to role',
                $parent
            ]);
        }

    }
    public function temp(Request $request)
    {
        $user = User::where('email', $request->get('email'))->first();
        $user->role_id = 2;
        $user->parent_id = null;
        $user->save();
        return response()->json([
            'message' => 'done',
            $user,
            auth()->id()
        ]);
    }
}
