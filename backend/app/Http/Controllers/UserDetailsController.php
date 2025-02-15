<?php

namespace App\Http\Controllers;

use App\Services\UserDetailsService;
use Illuminate\Http\Request;


class UserDetailsController extends Controller
{
    protected UserDetailsService $userDetailsService;

    public function __construct(UserDetailsService $userDetailsService)
    {
        $this->userDetailsService = $userDetailsService;
    }

    public function getUserDetails(Request $request)
    {
        $userId = auth()->id();

        if (!$userId) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = $this->userDetailsService->getUserDetails($userId);

        if ($user) {
            return response()->json(
                $user
            );
        }

        return response()->json([
            'message' => 'User not found'
        ], 404);
    }
}

