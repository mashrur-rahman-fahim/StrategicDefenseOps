<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * @throws \Illuminate\Auth\AuthenticationException
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        try {
            // Get the authenticated user
            $user = $request->user();

            // Check if the user is authenticated
            if (!$user) {
                throw new AuthenticationException('Unauthenticated access attempt');
            }

            // Check if email is already verified
            if ($user->hasVerifiedEmail()) {
                return $this->redirectVerifiedUser();
            }

            // Mark email as verified
            if ($user->markEmailAsVerified()) {
                event(new Verified($user));
            }

            return $this->redirectVerifiedUser();

        } catch (AuthenticationException $e) {
            throw $e; // Let the handler process authentication errors
        } catch (ModelNotFoundException $e) {
            Log::error('Email verification failed: User not found');
            throw new HttpException(404, 'User record not found');
        } catch (\Exception $e) {
            Log::error('Email verification error: ' . $e->getMessage());
            throw new HttpException(500, 'Email verification failed');
        }
    }

    protected function redirectVerifiedUser(): RedirectResponse
    {
        return redirect()->intended(
            config('app.frontend_url') . RouteServiceProvider::HOME . '?verified=1'
        );
    }
}