<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
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

            // Set the token expiration time (e.g., 120 minutes)
            $expiresAt = Carbon::now()->addMinutes(config('session.lifetime'));

            // Create the API token with an expiration time
            $token = $user->createToken('API Token', [], $expiresAt);

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

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        try {
            $user = Auth::user();

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