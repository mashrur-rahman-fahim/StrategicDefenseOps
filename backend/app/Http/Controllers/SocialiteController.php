<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
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

    public function googleAuthentication(Request $request) {
        try {
            $googleUser = Socialite::driver('google')->user();
            $role = $request->query('role', 1); // Default to role 1 if not provided
    
            if (! in_array($role, [1, 2, 3, 4])) {
                return redirect()->route('login')->with('error', 'Invalid role specified.');
            }
    
            $user = User::where('google_id', $googleUser->id)->first();
    
            if (!$user) {
                // Create a new user
                $user = new User();
                $user->name = $googleUser->name;
                $user->email = $googleUser->email;
                $user->password = Hash::make('password');
                $user->google_id = $googleUser->id;
                $user->role_id = $role;
                $user->parent_id = null;
                $user->email_verified_at = now(); 
                $user->save();
            }
    
            // Prepare credentials to send to login API
            $credentials = [
                'email' => $user->email,
                'password' => $user->password, // Ensure this matches what was stored
            ];
    
            // Make an internal request to the login API
            $loginRequest = Request::create('/login', 'POST', $credentials);
            $response = app()->handle($loginRequest);
    
            // Check if login was successful
            if ($response->getStatusCode() === 200) {
                return redirect()->intended(config('app.frontend_url').'/dashboard');
            }
    
            return redirect()->route('login')->with('error', 'Auto-login failed.');
            
        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::error('InvalidStateException: '.$e->getMessage());
            return redirect()->route('login')->with('error', 'Authentication failed.');
        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'An error occurred during authentication.');
        }
    }
    
}
