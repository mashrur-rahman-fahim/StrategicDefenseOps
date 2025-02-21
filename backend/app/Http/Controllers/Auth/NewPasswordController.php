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
                Activity::create([
                    'log_name' => 'password_reset',
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'description' => 'User successfully reset their password.',
                    'subject_type' => 'App\Models\User',
                    'subject_id' => $user->id,
                    'causer_type' => 'App\Models\User',
                    'causer_id' => $user->id,
                    'properties' => json_encode([
                        'method' => 'email reset',
                    ])
                ]);
            }
        );

        if ($status != Password::PASSWORD_RESET) {
            
             // Audit Log : failed password reset attempt
             Activity::create([
                'log_name' => 'password_reset_failed',
                'user_email' => $request->email,
                'description' => 'User failed to reset their password.',
                'subject_type' => null,
                'subject_id' => null,
                'causer_type' => null,
                'causer_id' => null,
                'properties' => json_encode([
                    'status' => $status,
                ])
            ]);

            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['status' => __($status)]);
    }
}
