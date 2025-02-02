<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Log;
use App\Exceptions\InvalidRoleException;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate the request data
            $validatedData = $this->validateRegistrationRequest($request);

            // Create the user
            $user = $this->createUser($validatedData);

            // Trigger registration event
            event(new Registered($user));

            // Authenticate the user
            Auth::login($user);

            // Generate API token
            $token = $user->createToken('API Token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully',
                'token' => $token,
            ], 201);

        } catch (ValidationException $e) {
            throw $e; // Let the handler process validation errors
        } catch (QueryException $e) {
            Log::error('User registration database error: ' . $e->getMessage());
            throw new \Exception('Failed to create user due to a system error');
        } catch (AuthenticationException $e) {
            throw new AuthenticationException('Failed to authenticate newly registered user');
        } catch (\Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage());
            throw new \Exception('User registration could not be completed');
        }
    }

    protected function validateRegistrationRequest(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => ['required', 'exists:roles,id'],
            'parent_id' => ['nullable', 'exists:users,id'],
        ]);
    }

    protected function createUser(array $data): User
    {
        try {
            return User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role_id' => $data['role_id'],
                'parent_id' => $data['parent_id'] ?? null,
            ]);
        } catch (QueryException $e) {
            if ($e->errorInfo[1] == 1062) { // Duplicate entry
                throw new \Exception('User with this email already exists');
            }
            throw $e;
        }
    }
}