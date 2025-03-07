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

    public function googleAuthentication(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $role = $request->query('role', 1); // Default role

            if (!in_array($role, [1, 2, 3, 4])) {
                return response()->json(['error' => 'Invalid role specified.'], 400);
            }

            // Check if a user with the same email exists
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // If user exists but has no google_id, update it
                if (!$user->google_id) {
                    $user->google_id = $googleUser->id;
                    $user->save();
                }

                return response()->json([
                    'message' => 'User already registered. Logged in successfully.',
                    'email' => $user->email
                ], 200);
            }

            // Generate a temporary password
            $tempPassword = 'password123'; // You can make this more secure

            // Create a new user
            $user = new User();
            $user->name = $googleUser->name;
            $user->email = $googleUser->email;
            $user->password = Hash::make($tempPassword);
            $user->google_id = $googleUser->id;
            $user->role_id = $role;
            $user->parent_id = null;
            $user->email_verified_at = now();
            $user->save();

            return response()->json([
                'email' => $user->email,
                'password' => $tempPassword, // Send plain password for login
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Authentication failed.'], 500);
        }
    }
}
