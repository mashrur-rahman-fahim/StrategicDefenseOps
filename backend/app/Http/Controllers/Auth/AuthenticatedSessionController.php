<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    
    public function store(LoginRequest $request): JsonResponse
    {

        $request->session()->regenerate();
        $user=Auth::user();
        return response()->json([
            $user
        ]);
        $token=$user->createToken('API Token')->plainTextToken;

        return response()->json([
            $token
        ]);
        // return response()->noContent();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $user = Auth::user();
    if ($user) {
        $user->tokens->each(function ($token) {
            $token->delete(); // Delete each API token
        });
    }
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
