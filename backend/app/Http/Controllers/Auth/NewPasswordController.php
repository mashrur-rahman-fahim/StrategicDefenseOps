<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Spatie\Activitylog\Facades\Activity;

class NewPasswordController extends Controller
{
    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
                // Audit Log : successful password reset
                activity()
                    ->causedBy($user instanceof \Illuminate\Database\Eloquent\Model ? $user : null)
                    ->performedOn($user instanceof \Illuminate\Database\Eloquent\Model ? $user : null)
                    ->tap(function ($activity) use ($user) {
                        $activity->log_name = 'new_password_reset';
                        $activity->user_id = $user->id;
                        $activity->user_name = $user->name;
                        $activity->user_email = $user->email;
                        $activity->role_id = $user->role_id;
                        $activity->description = 'User successfully reset their password.';
                        $activity->subject_type = 'App\Models\User';
                        $activity->subject_id = $user->id;
                        $activity->causer_type = 'App\Models\User';
                        $activity->causer_id = $user->id;
                        $activity->properties = json_encode([
                            'method' => 'email reset',
                        ]);
                        $activity->event = 'password_reset';
                        $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                        $activity->created_at = now();
                        $activity->updated_at = now();
                    })
                    ->withProperties([
                        'assigned_user_name' => $user->name,
                        'assigned_user_email' => $user->email,
                        'assigned_role' => $user->role_id,
                        'parent_id' => null,  // Add the parent_id if available
                        'status' => 'password_reset_successful',
                        'error_message' => null,
                        'timestamp' => now()->toDateTimeString(),
                    ])
                    ->log("User successfully reset their password.");
            }
        );

        if ($status != Password::PASSWORD_RESET) {

            // Audit Log : failed password reset attempt
            activity()
                ->causedBy(null)
                ->tap(function ($activity) use ($request, $status) {
                    $activity->log_name = 'new_password_reset_failed';
                    $activity->user_email = $request->email;
                    $activity->description = 'User failed to reset their password.';
                    $activity->subject_type = null;
                    $activity->subject_id = null;
                    $activity->causer_type = null;
                    $activity->causer_id = null;
                    $activity->properties = json_encode([
                        'status' => $status,
                    ]);
                    $activity->event = 'password_reset_failed';
                    $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'assigned_user_name' => 'N/A',
                    'assigned_user_email' => $request->email,
                    'assigned_role' => 'N/A',
                    'parent_id' => null,
                    'status' => 'password_reset_failed',
                    'error_message' => $status,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log("User failed to reset their password: {$request->email}");



            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['status' => __($status)]);
    }
}
