<?php

use App\Http\Controllers\SocialiteController;
use App\Mail\TestEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});
Route::get('/mail', function () {
    Mail::to('tahsinaryan888@gmail.com')->send(new TestEmail);
});
// Route::controller(SocialiteController::class)->group(function(){
//      Route::get('auth/google','googleLogin');
//      Route::get('auth/google-callback','googleAuthentication');
//     });
/*     Route::middleware(['web', EnsureFrontendRequestsAreStateful::class])->group(function () {
        Route::controller(SocialiteController::class)->group(function() {
            Route::get('auth/google', 'googleLogin');
            Route::get('auth/google-callback', 'googleAuthentication');
        });
    }); */

//    Route::get('/dashboard', function () {
//     return view('dashboard');
//  })->name('dashboard');
/* Route::middleware(['web', EnsureFrontendRequestsAreStateful::class])
    ->group(function () {
        Route::controller(SocialiteController::class)->group(function () {
            Route::get('auth/google', 'googleLogin');
            Route::get('auth/google-callback', 'googleAuthentication');
        });
    }); */

    Route::middleware('guest')->group(function () {
        Route::get('auth/google', [SocialiteController::class, 'googleLogin']);
        Route::get('auth/google-callback', [SocialiteController::class, 'googleAuthentication']);
    });

/*     Route::get('/auth/google',function(Request $request){
        return Socialite::driver('google')->redirect();
    });
    Route::get('/auth/google-callback',function(Request $request){
        dd($request->all());
    }); */

require __DIR__.'/auth.php';
