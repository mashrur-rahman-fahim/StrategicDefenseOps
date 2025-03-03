<?php


use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\UserDetailsController;
use Illuminate\Support\Facades\Route;

/* Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::get('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout'); */



// Routes accessible only to guests
Route::middleware('guest')->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store'])
         ->name('register');

    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
         ->name('login');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
         ->name('password.email');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
         ->name('password.store');
});

// Routes requiring authentication and additional safeguards
Route::middleware(['auth', 'signed', 'throttle:6,1'])->group(function () {
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
         ->name('verification.verify');
});

Route::middleware(['auth', 'throttle:6,1'])->group(function () {
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
         ->name('verification.send');
});

// Authenticated user routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
         ->name('logout');
});


// Route::get('/me', [UserDetailsController::class, 'getUserDetails'])->middleware('auth');

