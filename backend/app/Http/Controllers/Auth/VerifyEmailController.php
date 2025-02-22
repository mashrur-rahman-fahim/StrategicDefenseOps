<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Spatie\Activitylog\Facades\Activity;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {

            // Audit Log : when the user tries to verify an already verified email
            Activity::create([
                'log_name' => 'email_verification',
                'user_id' => $request->user()->id, 
                'user_name' => $request->user()->name,
                'user_email' => $request->user()->email,
                'description' => 'Tried to verify email, but email is already verified.',
                'subject_type' => 'App\Models\User',
                'subject_id' => $request->user()->id,
                'causer_type' => 'App\Models\User',
                'causer_id' => $request->user()->id,
                'properties' => json_encode([
                    'status' => 'already_verified',
                    'timestamp' => now()->toDateTimeString(),
                ])
            ]);

            return redirect()->intended(
                config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
            );
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));

            // Audit Log : when the email is successfully verified
            Activity::create([
                'log_name' => 'email_verification',
                'user_id' => $request->user()->id, 
                'user_name' => $request->user()->name,
                'user_email' => $request->user()->email,
                'description' => 'Email successfully verified.',
                'subject_type' => 'App\Models\User',
                'subject_id' => $request->user()->id,
                'causer_type' => 'App\Models\User',
                'causer_id' => $request->user()->id,
                'properties' => json_encode([
                    'status' => 'verified',
                    'timestamp' => now()->toDateTimeString(),
                ])
            ]);
        }

        return redirect()->intended(
            config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
        );
    }
}
