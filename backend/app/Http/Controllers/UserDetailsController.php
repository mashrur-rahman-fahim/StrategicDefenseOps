<?php

namespace App\Http\Controllers;

use App\Services\UserDetailsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Log;
use App\Exceptions\UserNotAssignedException;

class UserDetailsController extends Controller
{
    protected UserDetailsService $userDetailsService;
    
    public function __construct(UserDetailsService $userDetailsService)
    {
        $this->userDetailsService = $userDetailsService;
    }

    public function getUserDetails(Request $request): JsonResponse
    {
        try {
            // Get authenticated user ID
            $userId = auth()->id();
            
            // Validate presence of authenticated user
            if (!$userId) {
                throw new AuthenticationException('Unauthenticated access attempt');
            }

            // Retrieve user details through service
            $user = $this->userDetailsService->getUserDetails($userId);
            
            // Check if user was found
            if (!$user) {
                throw new ModelNotFoundException('User credentials not found in registry');
            }

            return response()->json([
                'success' => true,
                'message' => 'User details retrieved successfully',
                'data' => $user
            ]);

        } catch (AuthenticationException $e) {
            throw $e; // Let handler process authentication errors
        } catch (ModelNotFoundException $e) {
            Log::warning("User details lookup failed for ID: {$userId}");
            throw new ModelNotFoundException('Military personnel record not found');
        } catch (\Exception $e) {
            Log::error("Critical user details failure: {$e->getMessage()}");
            throw new \Exception('Failed to retrieve personnel records');
        }
    }
}