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
            activity()
                ->causedBy($request->user())
                ->performedOn($request->user())
                ->tap(function ($activity) use ($request) {
                    $activity->log_name = 'email_verification';
                    $activity->user_id = $request->user()->id;
                    $activity->user_name = $request->user()->name;
                    $activity->user_email = $request->user()->email;
                    $activity->description = 'Tried to verify email, but email is already verified.';
                    $activity->subject_type = 'App\Models\User';
                    $activity->subject_id = $request->user()->id;
                    $activity->causer_type = 'App\Models\User';
                    $activity->causer_id = $request->user()->id;
                    $activity->properties = json_encode([
                        'status' => 'already_verified',
                        'timestamp' => now()->toDateTimeString(),
                    ]);
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'assigned_user_name' => $request->user()->name ?? 'N/A',
                    'assigned_user_email' => $request->user()->email ?? 'N/A',
                    'assigned_role' => null,
                    'parent_id' => null,
                    'status' => 'already_verified',
                    'error_message' => null,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log("Tried to verify email, but email is already verified for {$request->user()->email}");


            return redirect()->intended(
                config('app.frontend_url') . RouteServiceProvider::HOME . '?verified=1'
            );
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));

            // Audit Log : when the email is successfully verified
            activity()
                ->causedBy($request->user())
                ->performedOn($request->user())
                ->tap(function ($activity) use ($request) {
                    $activity->log_name = 'email_verification';
                    $activity->user_id = $request->user()->id;
                    $activity->user_name = $request->user()->name;
                    $activity->user_email = $request->user()->email;
                    $activity->description = 'Email successfully verified.';
                    $activity->subject_type = 'App\Models\User';
                    $activity->subject_id = $request->user()->id;
                    $activity->causer_type = 'App\Models\User';
                    $activity->causer_id = $request->user()->id;
                    $activity->properties = json_encode([
                        'status' => 'verified',
                        'timestamp' => now()->toDateTimeString(),
                    ]);
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'assigned_user_name' => $request->user()->name ?? 'N/A',
                    'assigned_user_email' => $request->user()->email ?? 'N/A',
                    'assigned_role' => null,  
                    'parent_id' => null,  
                    'status' => 'verified',
                    'error_message' => null,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log("Email successfully verified for {$request->user()->email}");
        }

        return redirect()->intended(
            config('app.frontend_url') . RouteServiceProvider::HOME . '?verified=1'
        );
    }
}
