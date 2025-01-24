<?php

use App\Http\Controllers\AssignRoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/manager-assign',[AssignRoleController::class,'managerAssign'], )
->middleware('auth:sanctum')
;
Route::post('/temp',[AssignRoleController::class,'temp'])
->middleware('auth:sanctum')
;