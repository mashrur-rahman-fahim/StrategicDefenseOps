<?php

namespace App\Http\Controllers;

use App\Models\User;
use Hash;
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
    public function operatorAssign(Request $request)
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
                $operator->parent_id = $manager->id;
                $operator->save();
                return response()->json([
                    $operator,
                    $manager,
                    $parent



                ]);
            }

        } elseif ($parent && $parent->role_id == 2) {
            $request->validate([

                'operatorEmail' => 'required|email|exists:users,email'
            ]);


            $operatorEmail = $request->get('operatorEmail');

            $operator = User::where('email', $operatorEmail)->where('role_id', 3)->where('parent_id', null)->first();
            if ($operator) {
                $operator->parent_id = $parentId;
                $operator->save();
                return response()->json([
                    $operator,

                    $parent



                ]);
            }

        }
        return response()->json([
            'message' => 'Not assigned to role',
            $parent
        ]);


    }


    public function viewerAssign(Request $request)
    {
        $parentId = auth()->id();
        $parent = User::find($parentId);
        if ($parent && $parent->role_id == 1) {
            $request->validate([
                'managerEmail' => 'required|email|exists:users,email',
                'viewerEmail' => 'required|email|exists:users,email'
            ]);

            $managerEmail = $request->get('managerEmail');
            $viewerEmail = $request->get('viewerEmail');
            $manager = User::where('email', $managerEmail)
                ->where('role_id', 2)->where('parent_id', $parentId)->first();
            $viewer = User::where('email', $viewerEmail)->where('role_id', 4)->where('parent_id', null)->first();
            if ($manager && $viewer) {
                $viewer->parent_id = $manager->id;
                $viewer->save();
                return response()->json([
                    $viewer,
                    $manager,
                    $parent



                ]);
            }

        } elseif ($parent && $parent->role_id == 2) {
            $request->validate([

                'viewerEmail' => 'required|email|exists:users,email'
            ]);


            $viewerEmail = $request->get('viewerEmail');

            $viewer = User::where('email', $viewerEmail)->where('role_id', 4)->where('parent_id', null)->first();
            if ($viewer) {
                $viewer->parent_id = $parentId;
                $viewer->save();
                return response()->json([
                    $viewer,

                    $parent



                ]);
            }

        }
        return response()->json([
            'message' => 'Not assigned to role',
            $parent
        ]);


    }




    public function temp(Request $request)
    {
        $operators = User::where('role_id', 3)
            ->where('parent_id', auth()->id())
            ->first();
        $operators->parent_id = null;
        $operators->save();

        return response()->json([
            $operators
        ]);
    }
}
