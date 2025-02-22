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
            activity()
                ->performedOn(new \App\Models\User())
                ->causedBy(null)
                ->tap(function ($activity) {
                    $activity->log_name = "user_details_access";
                    $activity->user_id = 0;
                    $activity->user_name = "Unknown";
                    $activity->user_email = "Unknown";
                    $activity->description = "Unauthorized attempt to access user details.";
                    $activity->subject_type = "App\Models\User";
                    $activity->subject_id = null;
                    $activity->causer_type = "App\Models\User";
                    $activity->causer_id = null;
                })
                ->withProperties([
                    'status' => 'unauthorized',
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log('Unauthorized Access to User Details');

            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = $this->userDetailsService->getUserDetails($userId);

        if ($user) {
            // Audit Log : successful retrieval of user details
            activity()
                ->performedOn($user)
                ->causedBy($request->user())
                ->tap(function ($activity) use ($request, $user) {
                    $activity->log_name = "user_details_access";
                    $activity->user_id = $request->user()->id;
                    $activity->user_name = $request->user()->name ?? 'Unknown';
                    $activity->user_email = $request->user()->email ?? 'Unknown';
                    $activity->description = "Successfully retrieved user details.";
                    $activity->subject_type = "App\Models\User";
                    $activity->subject_id = $user->id;
                    $activity->causer_type = "App\Models\User";
                    $activity->causer_id = $user->id;
                })
                ->withProperties([
                    'status' => 'success',
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log('Successfully Retrieved User Details');

            return response()->json(
                $user
            );
        }

        // Audit Log : user is not found
        activity()
            ->causedBy($request->user())
            ->tap(function ($activity) use ($request, $userId) {
                $activity->log_name = "user_details_access";
                $activity->user_id = $request->user()->id;
                $activity->user_name = $request->user()->name ?? 'Unknown';
                $activity->user_email = $request->user()->email ?? 'Unknown';
                $activity->description = "Failed to retrieve user details, user not found.";
                $activity->subject_type = "App\Models\User";
                $activity->subject_id = null;
                $activity->causer_type = "App\Models\User";
                $activity->causer_id = $userId;
            })
            ->withProperties([
                'status' => 'not_found',
                'timestamp' => now()->toDateTimeString(),
            ])
            ->log('Failed to Retrieve User Details (User Not Found)');


        return response()->json([
            'message' => 'User not found'
        ], 404);
    }
}
