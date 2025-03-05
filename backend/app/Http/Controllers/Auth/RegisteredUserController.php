<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

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
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'role_id' => ['required', 'exists:roles,id'],
                'parent_id' => ['nullable', 'exists:users,id'],
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role_id' => $validatedData['role_id'],
                'parent_id' => $request->parent_id,
            ]);

            // Audit Log the user registration event
            activity()
                ->performedOn($user)
                ->causedBy(Auth::user())
                ->tap(function ($activity) use ($user) {
                    $activity->log_name = 'Registered';
                    $activity->user_id = $user->id;
                    $activity->role_id = $user->role_id;
                    $activity->description = 'User registered';
                    $activity->subject_id = $user->id;
                    $activity->subject_type = 'App\Models\User';
                    $activity->causer_id = Auth::id();
                    $activity->causer_type = 'App\Models\User';
                    $activity->event = 'registered';
                    $activity->batch_uuid = null;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                })
                ->withProperties([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                ])
                ->log('User registered');

            event(new Registered($user));
            Auth::login($user);
            $token = $user->createToken('api_token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully',
                'token' => $token,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (QueryException $e) {
            $errorMessage = 'An error occurred while creating the user.';
            if ($e->errorInfo[1] === 1062) {
                $errorMessage = 'The email address is already in use.';
            }

            return response()->json([
                'message' => $errorMessage,
            ], 400);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred. Please try again later.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
