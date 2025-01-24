<?php

use App\Http\Controllers\AssignRoleController;
use App\Http\Controllers\UnassignRoleController;
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
Route::post('/operator-assign',[AssignRoleController::class,'operatorAssign'])
->middleware('auth:sanctum');

Route::post('/viewer-assign',[AssignRoleController::class,'viewerAssign'])
->middleware('auth:sanctum');

Route::post('/manager-unassign',[UnassignRoleController::class,'managerUnassign'])
->middleware('auth:sanctum');

Route::post('/operator-unassign',[UnassignRoleController::class,'operatorUnassign'])
->middleware('auth:sanctum');

Route::post('/viewer-unassign',[UnassignRoleController::class,'viewerUnassign'])
->middleware('auth:sanctum');
