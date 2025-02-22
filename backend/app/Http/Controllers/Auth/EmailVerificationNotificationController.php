<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Facades\Activity;
use Illuminate\Support\Str;


class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            // Audit Log : when the user already has verified email
            Activity::create([
                'log_name' => 'email_verification_notificaiton',
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name,
                'user_email' => $request->user()->email,
                'role_id' => $request->user()->role_id,
                'description' => 'Tried to send verification email, but the email is already verified.',
                'subject_type' => 'App\Models\User',
                'subject_id' => $request->user()->id,
                'causer_type' => 'App\Models\User',
                'causer_id' => $request->user()->id,
                'properties' => json_encode([
                    'status' => 'already_verified',
                    'timestamp' => now()->toDateTimeString(),
                ]),
                'event' => 'email_verification_notified',
                'batch_uuid' => Str::uuid()->toString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return redirect()->intended(RouteServiceProvider::HOME);
        }

        $request->user()->sendEmailVerificationNotification();

        // Audit Log : when the verification link is sent
        Activity::create([
            'log_name' => 'email_verification',
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name,
            'user_email' => $request->user()->email,
            'role_id' => $request->user()->role_id,
            'description' => 'Verification email sent.',
            'subject_type' => 'App\Models\User',
            'subject_id' => $request->user()->id,
            'causer_type' => 'App\Models\User',
            'causer_id' => $request->user()->id,
            'properties' => json_encode([
                'status' => 'verification_sent',
                'timestamp' => now()->toDateTimeString(),
            ]),
            'event' => 'email_verification_sent',
            'batch_uuid' => Str::uuid()->toString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['status' => 'verification-link-sent']);
    }
}
