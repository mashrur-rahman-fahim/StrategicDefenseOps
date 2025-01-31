<?php

use App\Http\Controllers\SocialiteController;
use App\Mail\TestEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

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
Route::get('/mail',function(){
        Mail::to('tahsinaryan888@gmail.com')->send(new TestEmail());
});
Route::controller(SocialiteController::class)->group(function(){
    Route::get('auth/google','googleLogin');
    Route::get('auth/google-callback','googleAuthentication');
   });

require __DIR__.'/auth.php';

