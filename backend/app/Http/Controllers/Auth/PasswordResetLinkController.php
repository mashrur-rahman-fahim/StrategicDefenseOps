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
            Activity::create([
                'log_name' => 'success_password_reset_request',
                'user_id' => $user ? $user->id : null, 
                'user_name' => $user ? $user->name : null, 
                'user_email' => $user ? $user->email : null, 
                'role_id' => $user ? $user->role_id : null, 
                'description' => 'Password reset link sent to ' . $request->email,
                'subject_type' => null, 
                'subject_id' => null,   
                'causer_type' => 'App\Models\User', 
                'causer_id' => $user ? $user->id : null, 
                'properties' => json_encode([
                    'email' => $request->email,
                ])
            ]);
        } else {
            // Audit Log : reset link could not be sent
            Activity::create([
                'log_name' => 'failed_password_reset_request',
                'user_id' => $user ? $user->id : null, 
                'user_name' => $user ? $user->name : null,
                'user_email' => $user ? $user->email : null,
                'role_id' => $user ? $user->role_id : null,
                'description' => 'Failed to send password reset link to ' . $request->email,
                'subject_type' => null,
                'subject_id' => null,
                'causer_type' => 'App\Models\User',
                'causer_id' => $user ? $user->id : null,
                'properties' => json_encode([
                    'email' => $request->email,
                    'error_message' => $status, 
                ])
            ]);
        }

        if ($status != Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }
        
        
        return response()->json(['status' => __($status)]);
    }
}
