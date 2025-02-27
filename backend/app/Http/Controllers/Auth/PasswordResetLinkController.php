<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Auth;


class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = Auth::user();

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink(
            $request->only('email'),

        );
        // Log activity only if the link was sent successfully
        if ($status == Password::RESET_LINK_SENT) {
            // Audit Log : sending the reset link
            activity()
                ->causedBy($user)
                ->performedOn($user instanceof \Illuminate\Database\Eloquent\Model ? $user : null)
                ->tap(function ($activity) use ($request, $user) {
                    $activity->log_name = 'success_password_reset_request';
                    $activity->user_id = $user ? $user->id : null;
                    $activity->user_name = $user ? $user->name : null;
                    $activity->user_email = $user ? $user->email : null;
                    $activity->role_id = $user ? $user->role_id : null;
                    $activity->description = 'Password reset link sent to ' . $request->email;
                    $activity->subject_type = null;
                    $activity->subject_id = null;
                    $activity->causer_type = 'App\Models\User';
                    $activity->causer_id = $user ? $user->id : null;
                    $activity->properties = json_encode([
                        'email' => $request->email,
                    ]);
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'assigned_user_name' => $user ? $user->name : 'N/A',
                    'assigned_user_email' => $user ? $user->email : 'N/A',
                    'assigned_role' => $user ? $user->role_id : 'N/A',
                    'parent_id' => null,  // Add the parent_id if available
                    'status' => 'password_reset_request_sent',
                    'error_message' => null,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log("Password reset link sent to {$request->email}");
        } else {
            // Audit Log : reset link could not be sent
            activity()
                ->causedBy($user instanceof \Illuminate\Database\Eloquent\Model ? $user : null)  
                ->performedOn($user instanceof \Illuminate\Database\Eloquent\Model ? $user : null)  
                ->tap(function ($activity) use ($request, $user, $status) {
                    $activity->log_name = 'failed_password_reset_request';
                    $activity->user_id = $user ? $user->id : null;
                    $activity->user_name = $user ? $user->name : null;
                    $activity->user_email = $user ? $user->email : null;
                    $activity->role_id = $user ? $user->role_id : null;
                    $activity->description = 'Failed to send password reset link to ' . $request->email;
                    $activity->subject_type = null;  
                    $activity->subject_id = null;    
                    $activity->causer_type = 'App\Models\User';
                    $activity->causer_id = $user ? $user->id : null;
                    $activity->properties = json_encode([
                        'email' => $request->email,
                        'error_message' => $status,
                    ]);
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'assigned_user_name' => $user ? $user->name : 'N/A',
                    'assigned_user_email' => $user ? $user->email : 'N/A',
                    'assigned_role' => $user ? $user->role_id : 'N/A',
                    'parent_id' => null, 
                    'status' => 'failed_password_reset_request',
                    'error_message' => $status,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log("Failed to send password reset link to {$request->email}");
        }

        if ($status != Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }


        return response()->json(['status' => __($status)]);
    }
}
