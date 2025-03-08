<?php

use App\Http\Controllers\AssignRoleController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\OllamaController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationResourcesController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResourcesController;
use App\Http\Controllers\RoleViewController;
use App\Http\Controllers\UnassignRoleController;
use App\Http\Controllers\UserDetailsController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\WeaponController;
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

// Role Assignment/Unassignment :
Route::middleware('auth:sanctum')->group(function () {
    // Role Assignment
    Route::controller(AssignRoleController::class)->group(function () {
        Route::post('/manager-assign', 'managerAssign');

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

Route::post('/add-operation-resources/{operationId}', [OperationResourcesController::class, 'createOperationResource'])->middleware('auth:sanctum');

Route::get('/get-operation-resources/{operationId}', [OperationResourcesController::class, 'getAllOperationResources'])->middleware('auth:sanctum');

Route::put('/update-operation-resources/{operationId}', [OperationResourcesController::class, 'updateOperationResource'])->middleware('auth:sanctum');

Route::post('/generate-report/{operationId}', [ReportController::class, 'generateReport'])->middleware('auth:sanctum');

Route::get('/get-all-resources', [ResourcesController::class, 'getAllResources'])->middleware('auth:sanctum');

Route::post('/ollama/generate', [OllamaController::class, 'generateResponse'])->middleware('auth:sanctum');

Route::get('/role-view', [RoleViewController::class, 'roleView'])->middleware('auth:sanctum');

Route::put('/update-profile', [ProfileController::class, 'updateProfile'])->middleware('auth:sanctum');

Route::delete('/delete-profile', [ProfileController::class, 'deleteProfile'])->middleware('auth:sanctum');

Route::put('/edit-report/{operationId}', [ReportController::class, 'editReport'])->middleware('auth:sanctum');
Route::delete('/delete-report/{operationId}',[ReportController::class, 'deleteReport'])->middleware('auth:sanctum');
Route::get('/view-report/{operationId}',[ReportController::class,'viewReport'])->middleware('auth:sanctum');