<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Activitylog\Facades\Activity;

class SocialiteController extends Controller
{
    public function googleLogin()
    {
        return Socialite::driver('google')->redirect();
    }

    public function googleAuthentication(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $role = $request->query('role');


            if (!in_array($role, [1, 2, 3, 4])) {
                throw new Exception("Invalid role specified.");
            }

            $user = User::where('google_id', $googleUser->id)->first();
            if ($user) {
                Auth::login($user);

                // Audit Log : existing user login
                activity()
                    ->causedBy($user)
                    ->performedOn($user)
                    ->tap(function ($activity) use ($user, $googleUser) {
                        $activity->log_name = 'social_login';
                        $activity->user_id = $user->id;
                        $activity->user_name = $user->name;
                        $activity->user_email = $user->email;
                        $activity->role_id = $user->role_id;
                        $activity->description = 'User logged in via Google.';
                        $activity->subject_type = get_class($user);
                        $activity->subject_id = $user->id;
                        $activity->causer_type = get_class($user);
                        $activity->causer_id = $user->id;
                    })
                    ->withProperties([
                        'provider' => 'google',
                        'google_id' => $googleUser->id,
                        'timestamp' => now()->toDateTimeString(),
                    ])
                    ->log('User logged in via Google.');

                return redirect()->route('dashboard');
            } else {
                $userData = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make('password'),
                    'google_id' => $googleUser->id,
                    'role_id' => $role,
                    'parent_id' => null,
                ]);

                if ($userData) {
                    Auth::login($userData);
                    // Audit Log : new user registration
                    activity()
                        ->causedBy($userData)
                        ->performedOn($userData)
                        ->tap(function ($activity) use ($userData, $googleUser) {
                            $activity->log_name = 'social_registration';
                            $activity->user_id = $userData->id;
                            $activity->user_name = $userData->name;
                            $activity->user_email = $userData->email;
                            $activity->role_id = $userData->role_id;
                            $activity->description = 'New user registered via Google.';
                            $activity->subject_type = get_class($userData);
                            $activity->subject_id = $userData->id;
                            $activity->causer_type = get_class($userData);
                            $activity->causer_id = $userData->id;
                        })
                        ->withProperties([
                            'provider' => 'google',
                            'google_id' => $googleUser->id,
                            'timestamp' => now()->toDateTimeString(),
                        ])
                        ->log('New user registered via Google.');

                    return redirect()->route('dashboard');
                }
            }
        } catch (Exception $e) {
            // Audit Log : failed authentication attempt
            activity()
                ->causedBy(null)
                ->tap(function ($activity) use ($e) {
                    $activity->log_name = 'social_authentication_failed';
                    $activity->user_id = null;
                    $activity->user_name = null;
                    $activity->user_email = null;
                    $activity->description = 'Google authentication failed.';
                    $activity->subject_type = null;
                    $activity->subject_id = null;
                    $activity->causer_type = null;
                    $activity->causer_id = null;
                })
                ->withProperties([
                    'error_message' => $e->getMessage(),
                    'provider' => 'google',
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log('Google authentication failed.');



            /*For Debugging purpose only 
             * dd($e); */
        }
    }
}
