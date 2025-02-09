<?php

use App\Http\Controllers\AssignRoleController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\UnassignRoleController;
use App\Http\Controllers\UserDetailsController;
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
Route::post('/manager-assign', [AssignRoleController::class, 'managerAssign'], )
    ->middleware('auth:sanctum')
;
Route::post('/temp', [AssignRoleController::class, 'temp'])
    ->middleware('auth:sanctum')
;
Route::post('/operator-assign', [AssignRoleController::class, 'operatorAssign'])
    ->middleware('auth:sanctum');

Route::post('/viewer-assign', [AssignRoleController::class, 'viewerAssign'])
    ->middleware('auth:sanctum');

Route::post('/manager-unassign', [UnassignRoleController::class, 'managerUnassign'])
    ->middleware('auth:sanctum');

Route::post('/operator-unassign', [UnassignRoleController::class, 'operatorUnassign'])
    ->middleware('auth:sanctum');

Route::post('/viewer-unassign', [UnassignRoleController::class, 'viewerUnassign'])
    ->middleware('auth:sanctum');

Route::get('/me', [UserDetailsController::class, 'getUserDetails'])->middleware('auth:sanctum');

Route::post('/create-operation', [OperationController::class, 'createOperation'])->middleware('auth:sanctum');

Route::put('/update-operation/{id}', [OperationController::class, 'updateOperation'])
->middleware('auth:sanctum');

Route::delete('/delete-operation/{id}',[OperationController::class,'deleteOperation'])
->middleware('auth:sanctum');

Route::get('/get-all-operations', [OperationController::class,'getAllOperations'])->middleware('auth:sanctum');

Route::get('/search-operations/{name}', [OperationController::class,'searchByName'])->middleware('auth:sanctum');

