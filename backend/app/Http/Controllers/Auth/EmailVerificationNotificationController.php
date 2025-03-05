<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            // Audit Log : when the user already has verified email
            activity()
                ->causedBy($request->user())
                ->performedOn($request->user())
                ->tap(function ($activity) use ($request) {
                    $activity->log_name = 'email_verification_notificaiton';
                    $activity->user_id = $request->user()->id;
                    $activity->user_name = $request->user()->name;
                    $activity->user_email = $request->user()->email;
                    $activity->role_id = $request->user()->role_id;
                    $activity->description = 'Tried to send verification email, but the email is already verified.';
                    $activity->subject_type = 'App\Models\User';
                    $activity->subject_id = $request->user()->id;
                    $activity->causer_type = 'App\Models\User';
                    $activity->causer_id = $request->user()->id;
                    $activity->properties = json_encode([
                        'status' => 'already_verified',
                        'timestamp' => now()->toDateTimeString(),
                    ]);
                    $activity->event = 'email_verification_notified';
                    $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'assigned_user_name' => $request->user()->name,
                    'assigned_user_email' => $request->user()->email,
                    'assigned_role' => $request->user()->role->name ?? 'N/A',
                    'parent_id' => null,
                    'status' => 'already_verified',
                    'error_message' => null,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log("Email verification notification: {$request->user()->email}");

            return redirect()->intended(RouteServiceProvider::HOME);
        }

        $request->user()->sendEmailVerificationNotification();

        // Audit Log : when the verification link is sent
        activity()
            ->causedBy($request->user())
            ->performedOn($request->user())
            ->tap(function ($activity) use ($request) {
                $activity->log_name = 'email_verification';
                $activity->user_id = $request->user()->id;
                $activity->user_name = $request->user()->name;
                $activity->user_email = $request->user()->email;
                $activity->role_id = $request->user()->role_id;
                $activity->description = 'Verification email sent.';
                $activity->subject_type = 'App\Models\User';
                $activity->subject_id = $request->user()->id;
                $activity->causer_type = 'App\Models\User';
                $activity->causer_id = $request->user()->id;
                $activity->properties = json_encode([
                    'status' => 'verification_sent',
                    'timestamp' => now()->toDateTimeString(),
                ]);
                $activity->event = 'email_verification_sent';
                $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                $activity->created_at = now();
                $activity->updated_at = now();
            })
            ->withProperties([
                'assigned_user_name' => $request->user()->name,
                'assigned_user_email' => $request->user()->email,
                'assigned_role' => $request->user()->role->name ?? 'N/A',
                'parent_id' => null,
                'status' => 'verification_sent',
                'error_message' => null,
                'timestamp' => now()->toDateTimeString(),
            ])
            ->log("Verification email sent: {$request->user()->email}");

        return response()->json(['status' => 'verification-link-sent']);
    }
}
