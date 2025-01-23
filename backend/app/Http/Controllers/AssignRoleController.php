<?php

namespace App\Http\Controllers;

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
        return response()->json([
            $email,
            $parentId,
            $role_id
        ]);

    }
}
