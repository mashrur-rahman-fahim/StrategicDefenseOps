<?php

namespace App\Http\Controllers;

use App\Services\UserDetailsService;
use Illuminate\Http\Request;
use Spatie\Activitylog\Facades\Activity;


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
            // Audit Log : unauthorized access attempt
            Activity::create([
                'log_name' => 'user_details_access',
                'user_name' => 'Unknown',  // Since the user is not authenticated
                'user_email' => 'Unknown',
                'description' => 'Unauthorized attempt to access user details.',
                'subject_type' => 'App\Models\User',
                'subject_id' => null,
                'causer_type' => 'App\Models\User',
                'causer_id' => null,
                'properties' => json_encode([
                    'status' => 'unauthorized',
                    'timestamp' => now()->toDateTimeString(),
                ])
            ]);
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = $this->userDetailsService->getUserDetails($userId);

        if ($user) {
            // Audit Log : successful retrieval of user details
            Activity::create([
                'log_name' => 'user_details_access',
                'user_name' => $request->user()->name ?? 'Unknown',
                'user_email' => $request->user()->email ?? 'Unknown',
                'description' => 'Successfully retrieved user details.',
                'subject_type' => 'App\Models\User',
                'subject_id' => $user->id,
                'causer_type' => 'App\Models\User',
                'causer_id' => $userId,
                'properties' => json_encode([
                    'status' => 'success',
                    'timestamp' => now()->toDateTimeString(),
                ])
            ]);
            return response()->json(
                $user
            );
        }

        // Audit Log : user is not found
        Activity::create([
            'log_name' => 'user_details_access',
            'user_name' => $request->user()->name ?? 'Unknown',
            'user_email' => $request->user()->email ?? 'Unknown',
            'description' => 'Failed to retrieve user details, user not found.',
            'subject_type' => 'App\Models\User',
            'subject_id' => null,
            'causer_type' => 'App\Models\User',
            'causer_id' => $userId,
            'properties' => json_encode([
                'status' => 'not_found',
                'timestamp' => now()->toDateTimeString(),
            ])
        ]);

        return response()->json([
            'message' => 'User not found'
        ], 404);
    }
}

