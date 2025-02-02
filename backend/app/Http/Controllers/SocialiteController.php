<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Exceptions\InvalidRoleException;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Laravel\Socialite\Two\InvalidStateException;

class SocialiteController extends Controller
{
    public function googleLogin()
    {
        try {
            return Socialite::driver('google')->redirect();
        } catch (\Exception $e) {
            Log::error('Google login redirect failed: ' . $e->getMessage());
            throw new HttpException(500, 'Unable to initiate Google authentication');
        }
    }

    public function googleAuthentication(Request $request)
    {
        try {
            // Validate the Google authentication response
            $googleUser = Socialite::driver('google')->user();
            
            // Validate role parameter
            $role = $this->validateRole($request->query('role'));

            // Find or create user
            $user = $this->findOrCreateGoogleUser($googleUser, $role);

            // Authenticate user
            Auth::login($user);

            return redirect()->route('dashboard');

        } catch (InvalidStateException $e) {
            Log::warning('Invalid Google authentication state: ' . $e->getMessage());
            throw new HttpException(419, 'Authentication session expired. Please try again.');
        } catch (InvalidRoleException $e) {
            throw $e; // Let the handler process this
        } catch (\Exception $e) {
            Log::error('Google authentication failed: ' . $e->getMessage());
            throw new HttpException(500, 'Authentication failed. Please try again later.');
        }
    }

    protected function validateRole($role): int
    {
        if (!in_array($role, [1, 2, 3, 4])) {
            throw new InvalidRoleException('Invalid security clearance level specified');
        }

        return (int)$role;
    }

    protected function findOrCreateGoogleUser($googleUser, int $role): User
    {
        try {
            // Try to find existing user
            $user = User::where('google_id', $googleUser->id)->first();

            if (!$user) {
                // Create new user if not found
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make('password'),
                    'google_id' => $googleUser->id,
                    'role_id' => $role,
                    'parent_id' => null,
                ]);

                if (!$user) {
                    throw new \Exception('Failed to create user account');
                }
            }

            return $user;

        } catch (\Exception $e) {
            Log::error('User creation failed: ' . $e->getMessage());
            throw new HttpException(500, 'Account setup failed. Please contact support.');
        }
    }
}