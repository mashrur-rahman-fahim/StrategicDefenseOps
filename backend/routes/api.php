<?php

use App\Http\Controllers\AssignRoleController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\ResourcesController;
use App\Http\Controllers\UnassignRoleController;
use App\Http\Controllers\UserDetailsController;
use App\Http\Controllers\WeaponController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\AuditLogController;




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



// Role Assignment/Unassignment :
Route::middleware('auth:sanctum')->group(function () {
    // Role Assignment
    Route::controller(AssignRoleController::class)->group(function () {
        Route::post('/manager-assign', 'managerAssign');
        Route::post('/temp', 'temp');
        Route::post('/operator-assign', 'operatorAssign');
        Route::post('/viewer-assign', 'viewerAssign');
    });

    // Role Unassignment
    Route::controller(UnassignRoleController::class)->group(function () {
        Route::post('/manager-unassign', 'managerUnassign');
        Route::post('/operator-unassign', 'operatorUnassign');
        Route::post('/viewer-unassign', 'viewerUnassign');
    });

    // User Details
    Route::get('/user', [UserDetailsController::class, 'getUserDetails']);
});


// Operation Create, Update, Delete, Search All, Individual Search by Name
Route::middleware('auth:sanctum')->controller(OperationController::class)->group(function () {
    Route::post('/create-operation', 'createOperation');
    Route::put('/update-operation/{id}', 'updateOperation');
    Route::delete('/delete-operation/{id}', 'deleteOperation');
    Route::get('/get-all-operations', 'getAllOperations');
    Route::get('/search-operations/{name}', 'searchByName');
});

// Weapon Add, Update, Delete, Search All, Individual Search by Name
Route::middleware('auth:sanctum')->controller(WeaponController::class)->group(function () {
    Route::post('/add-weapon', 'addWeapon');
    Route::put('/update-weapon/{weaponId}', 'updateWeapon');
    Route::delete('/delete-weapon/{weaponId}', 'deleteWeapon');
    Route::get('/get-all-weapons', 'getAllWeapons');
    Route::get('/search-weapons/{weaponName}', 'getWeaponByName');
});

// Vehicle Add, Update, Delete, Search All, Individual Search by Name
Route::middleware('auth:sanctum')->controller(VehicleController::class)->group(function () {
    Route::post('/add-vehicle', 'addVehicle');
    Route::put('/update-vehicle/{vehicleId}', 'updateVehicle');
    Route::delete('/delete-vehicle/{vehicleId}', 'deleteVehicle');
    Route::get('/get-all-vehicles', 'getAllVehicles');
    Route::get('/search-vehicles/{vehicleName}', 'getVehicleByName');
});


// Equipment Add, Update, Delete, Search All, Individual Search by Name
Route::middleware('auth:sanctum')->controller(EquipmentController::class)->group(function () {
    Route::post('/add-equipment', 'addEquipment');
    Route::put('/update-equipment/{equipmentId}', 'updateEquipment');
    Route::delete('/delete-equipment/{equipmentId}', 'deleteEquipment');
    Route::get('/get-all-equipment', 'getAllEquipment');
    Route::get('/search-equipment/{equipmentName}', 'getEquipmentByName');
});


// Personnel Add, Update, Delete, Search All, Individual Search by Name
Route::middleware('auth:sanctum')->controller(PersonnelController::class)->group(function () {
    Route::post('/add-personnel', 'addPersonnel');
    Route::put('/update-personnel/{personnelId}', 'updatePersonnel');
    Route::delete('/delete-personnel/{personnelId}', 'deletePersonnel');
    Route::get('/get-all-personnel', 'getAllPersonnel');
    Route::get('/search-personnel/{personnelName}', 'getPersonnelByName');
});


Route::middleware(['auth'])->group(function () {
    Route::get('/audit-logs/{user}', [AuditLogController::class, 'index'])
        ->middleware('audit.log.access');
});
