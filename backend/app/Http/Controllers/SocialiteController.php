<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

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
            $role = $request->query('role', 1); // Default to role 1 if not provided

            if (! in_array($role, [1, 2, 3, 4])) {
                return redirect()->route('login')->with('error', 'Invalid role specified.');
            }

            $user = User::where('google_id', $googleUser->id)->first();
            if ($user) {
                Auth::login($user);

                return redirect()->intended(
                    config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
                );
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

                    return redirect()->intended(
                        config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
                    );
                }
            }
        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::error('InvalidStateException: '.$e->getMessage());
            Log::error('Session State: '.session()->get('state'));
            Log::error('Request State: '.$request->input('state'));
            throw $e;
        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'An error occurred during authentication.');
        }
    }
}
