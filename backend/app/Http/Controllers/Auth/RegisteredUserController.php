<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request; 
use Illuminate\Http\Response;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Exception;

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
                 'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
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
