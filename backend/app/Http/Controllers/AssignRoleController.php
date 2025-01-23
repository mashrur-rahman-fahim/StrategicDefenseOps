<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AssignRoleController extends Controller
{
    //
    public function assignRole($role_id,Request $request){
        $request->validate([
            'email' =>'required|email|exists:users,email',
        ]);
        $parentId=auth()->id();
        return response()->json([
            $parentId,
            $role_id
        ]);

    }
}
