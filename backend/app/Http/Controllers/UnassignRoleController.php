<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnassignRoleController extends Controller
{
    //
    
    public function managerUnassign(Request $request): JsonResponse
    {
        $request->validate([
            'managerEmail' => 'required|email|exists:users,email',
        ]);
        $parentId = auth()->id();
        $parent = User::find($parentId);
        $managerEmail = $request->get('managerEmail');
        $manager = User::where('email', $managerEmail)->where('role_id', 2)->where('parent_id', $parentId)->first();
        if ($manager && $parentId && $parent->role_id == 1) {
            $manager->parent_id = null;
            $manager->save();
            return response()->json([
                $manager,
                $managerEmail,
                $parentId,

            ]);
        }
        return response()->json([
            'message' => 'failed',
            $parent
        ]);


    }
    public function operatorUnassign(Request $request)
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
            $operator = User::where('email', $operatorEmail)->where('role_id', 3)->where('parent_id', $manager->parent_id)->first();
            if ($manager && $operator) {
                $operator->parent_id = null;
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

            $operator = User::where('email', $operatorEmail)->where('role_id', 3)->where('parent_id', $parent->id)->first();
            if ($operator) {
                $operator->parent_id = null;
                $operator->save();
                return response()->json([
                    $operator,

                    $parent



                ]);
            }

        }
        return response()->json([
            'message' => 'failed',
            $parent
        ]);


    }


    public function viewerUnassign(Request $request)
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
            $viewer = User::where('email', $viewerEmail)->where('role_id', 4)->where('parent_id', $manager->id)->first();
            if ($manager && $viewer) {
                $viewer->parent_id = null;
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

            $viewer = User::where('email', $viewerEmail)->where('role_id', 4)->where('parent_id', $parentId)->first();
            if ($viewer) {
                $viewer->parent_id = null;
                $viewer->save();
                return response()->json([
                    $viewer,

                    $parent



                ]);
            }

        }
        return response()->json([
            'message' => 'failed',
            $parent
        ]);


    }





}
