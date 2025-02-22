<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Spatie\Activitylog\Facades\Activity;
use Illuminate\Support\Str;


class AuthenticatedSessionController extends Controller
{   
    
    /* 
     * Function : store
     * Description : Handles user authentication and generates an API token.
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function store(LoginRequest $request): JsonResponse
    {
        try {
         
            $request->authenticate();
            $request->session()->regenerate();

            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }
            
            // Audit Log : User login
            Activity::performedOn($user)
                ->causedBy(Auth::user())
                ->tap(function ($activity) use ($user) {
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->log_name = 'Login';
                    $activity->subject_type = 'App\Models\User';
                    $activity->subject_id = $user->id;
                    $activity->causer_type = 'App\Models\User';
                    $activity->causer_id = $user->id;
                    $activity->batch_uuid = Str::uuid()->toString();  // Generate unique batch UUID
                })
                ->withProperties([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                ])
                ->log('User logged in');


            // Set the token expiration time (e.g., 120 minutes)
            $expiresAt = Carbon::now()->addMinutes(config('session.lifetime'));

            // Create the API token with an expiration time
            $token = $user->createToken('api_token', [], $expiresAt);

            // Save the expiration time in the database
            $token->accessToken->expires_at = $expiresAt;
            $token->accessToken->save();

            // Return the token and its expiration time
            return response()->json([
                'token' => $token->plainTextToken,
                'expires_at' => $expiresAt->toDateTimeString(),
                'message' => 'Login successful'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during authentication',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }


     /* 
     * Function : destroy
     * Description : Logs out the user, deletes tokens, and invalidates the session.
     * @param Request $request
     * @return Response
     */
    public function destroy(Request $request): Response
    {
        try {
            $user = Auth::user();

            // Audit Log : User logout
            Activity::performedOn($user)
                ->causedBy(Auth::user())
                ->tap(function ($activity) use ($user) {
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->log_name = 'Logout';
                    $activity->subject_type = 'App\Models\User';
                    $activity->subject_id = $user->id;
                    $activity->causer_type = 'App\Models\User';
                    $activity->causer_id = $user->id;
                    $activity->batch_uuid = Str::uuid()->toString();  // Generate unique batch UUID
                })
                ->withProperties([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                ])
                ->log('User logged out');



            // Delete all API tokens for the user
            if ($user) {
                $user->tokens()->delete();
            }

            // Log out the user and invalidate the session
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->noContent();

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during logout',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}