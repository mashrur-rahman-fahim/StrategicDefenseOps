<?php

use App\Http\Controllers\AssignRoleController;
use App\Http\Controllers\OperationController;

use App\Http\Controllers\OperationResourcesController;
use App\Http\Controllers\ResourcesController;
use App\Http\Controllers\UnassignRoleController;
use App\Http\Controllers\UserDetailsController;
use App\Http\Controllers\WeaponController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\VehicleController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\EquipmentController;


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

Route::get('/user', [UserDetailsController::class, 'getUserDetails'])->middleware('auth:sanctum');

Route::post('/create-operation', [OperationController::class, 'createOperation'])->middleware('auth:sanctum');

Route::put('/update-operation/{id}', [OperationController::class, 'updateOperation'])
    ->middleware('auth:sanctum');

Route::delete('/delete-operation/{id}', [OperationController::class, 'deleteOperation'])
    ->middleware('auth:sanctum');

Route::get('/get-all-operations', [OperationController::class, 'getAllOperations'])->middleware('auth:sanctum');

Route::get('/search-operations/{name}', [OperationController::class, 'searchByName'])->middleware('auth:sanctum');

Route::post('/add-weapon', [WeaponController::class, 'addWeapon'])->middleware('auth:sanctum');

Route::put('/update-weapon/{weaponId}', [WeaponController::class, 'updateWeapon'])->middleware('auth:sanctum');

Route::delete('/delete-weapon/{weaponId}', [WeaponController::class, 'deleteWeapon'])->middleware('auth:sanctum');

Route::get('/get-all-weapons', [WeaponController::class, 'getAllWeapons'])->middleware('auth:sanctum');

Route::get('/search-weapons/{weaponName}', [WeaponController::class, 'getWeaponByName'])->middleware('auth:sanctum');


Route::post('/add-vehicle', [VehicleController::class, 'addVehicle'])->middleware('auth:sanctum');
Route::put('/update-vehicle/{vehicleId}', [VehicleController::class, 'updateVehicle'])->middleware('auth:sanctum');
Route::delete('/delete-vehicle/{vehicleId}', [VehicleController::class, 'deleteVehicle'])->middleware('auth:sanctum');
Route::get('/get-all-vehicles', [VehicleController::class, 'getAllVehicles'])->middleware('auth:sanctum');
Route::get('/search-vehicles/{vehicleName}', [VehicleController::class, 'getVehicleByName'])->middleware('auth:sanctum');



// Add a new equipment
Route::post('/add-equipment', [EquipmentController::class, 'addEquipment'])->middleware('auth:sanctum');

// Update an existing equipment
Route::put('/update-equipment/{equipmentId}', [EquipmentController::class, 'updateEquipment'])->middleware('auth:sanctum');

// Delete an equipment
Route::delete('/delete-equipment/{equipmentId}', [EquipmentController::class, 'deleteEquipment'])->middleware('auth:sanctum');

// Get all equipment
Route::get('/get-all-equipment', [EquipmentController::class, 'getAllEquipment'])->middleware('auth:sanctum');

// Search equipment by name
Route::get('/search-equipment/{equipmentName}', [EquipmentController::class, 'getEquipmentByName'])->middleware('auth:sanctum');




// Add a new personnel
Route::post('/add-personnel', [PersonnelController::class, 'addPersonnel'])->middleware('auth:sanctum');

// Update an existing personnel
Route::put('/update-personnel/{personnelId}', [PersonnelController::class, 'updatePersonnel'])->middleware('auth:sanctum');

// Delete a personnel
Route::delete('/delete-personnel/{personnelId}', [PersonnelController::class, 'deletePersonnel'])->middleware('auth:sanctum');

// Get all personnel
Route::get('/get-all-personnel', [PersonnelController::class, 'getAllPersonnel'])->middleware('auth:sanctum');

// Search personnel by name
Route::get('/search-personnel/{personnelName}', [PersonnelController::class, 'getPersonnelByName'])->middleware('auth:sanctum');

Route::post('/add-operation-resources/{operationId}', [OperationResourcesController::class,'createOperationResource'])->middleware('auth:sanctum');

Route::get('/get-operation-resources/{operationId}',[OperationResourcesController::class,'getAllOperationResources'])->middleware('auth:sanctum');

Route::put('/update-operation-resources/{operationId}',[OperationResourcesController::class,'updateOperationResource'])->middleware('auth:sanctum');
