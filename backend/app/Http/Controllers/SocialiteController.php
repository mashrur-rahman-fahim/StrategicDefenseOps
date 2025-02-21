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
    public function googleLogin(){
        return Socialite::driver('google')->redirect();
    }

    public function googleAuthentication(Request $request){
        try{
            $googleUser = Socialite::driver('google')->user();
            $role = $request->query('role');
    
            
            if (!in_array($role, [1, 2, 3, 4])) {
                throw new Exception("Invalid role specified.");
            }
    
            $user = User::where('google_id', $googleUser->id)->first();
            if($user){
                Auth::login($user);

                // Audit Log : existing user login
                Activity::create([
                    'log_name' => 'social_login',
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'role_id' => $user->role_id,
                    'description' => 'User logged in via Google.',
                    'subject_type' => 'App\Models\User',
                    'subject_id' => $user->id,
                    'causer_type' => 'App\Models\User',
                    'causer_id' => $user->id,
                    'properties' => json_encode([
                        'provider' => 'google',
                        'google_id' => $googleUser->id,
                    ])
                ]);

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
    
                if($userData){
                    Auth::login($userData);
                    // Audit Log : new user registration
                    Activity::create([
                        'log_name' => 'social_registration',
                        'user_name' => $userData->name,
                        'user_email' => $userData->email,
                        'role_id' => $userData->role_id,
                        'description' => 'New user registered via Google.',
                        'subject_type' => 'App\Models\User',
                        'subject_id' => $userData->id,
                        'causer_type' => 'App\Models\User',
                        'causer_id' => $userData->id,
                        'properties' => json_encode([
                            'provider' => 'google',
                            'google_id' => $googleUser->id,
                        ])
                    ]);
                    return redirect()->route('dashboard');
                }
            }
        } catch(Exception $e){
             // Audit Log : failed authentication attempt
             Activity::create([
                'log_name' => 'social_authentication_failed',
                'description' => 'Google authentication failed.',
                'subject_type' => null,
                'subject_id' => null,
                'causer_type' => null,
                'causer_id' => null,
                'properties' => json_encode([
                    'error_message' => $e->getMessage(),
                    'provider' => 'google'
                ])
            ]);

            /*For Debugging purpose only 
             * dd($e); */
        }
    }
}
