<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssignRoleController extends Controller
{
    //
    public function assignRole($role_id, Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);
        $parentId = auth()->id();
        $email = $request->get('email');
        $user=User::where('email', $email)->first();
        if($user && $user->role_id==$role_id  ){}
        return response()->json([
           $user,
            $email,
            $parentId,
            $role_id
        ]);

    }
}
