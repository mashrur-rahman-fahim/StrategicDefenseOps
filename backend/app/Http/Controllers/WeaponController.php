<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Weapon;
use App\Services\ResourceServices;
use App\Services\WeaponService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Facades\Activity;
use Illuminate\Support\Facades\Auth;

class WeaponController extends Controller
{
    protected WeaponService $weaponService;
    protected ResourceServices $resourceServices;

    public function __construct(WeaponService $weaponService, ResourceServices $resourceServices)
    {
        $this->weaponService = $weaponService;
        $this->resourceServices = $resourceServices;
    }

    /* 
     * Function : createWeapon
     * Description : Creates a new weapon in the system, validates input, and logs the activity.
     * @param Request $request - The incoming HTTP request containing the weapon data.
     * @return JsonResponse - Response indicating the success or failure of weapon creation.
     */
    public function addWeapon(Request $request)
    {
        try {
            // Validate weapon data
            $data = $request->validate([
                'weapon_name' => 'required|string|max:255',
                'weapon_description' => 'nullable|string',
                'weapon_count' => 'required|integer|min:1',
                'weapon_category' => 'nullable|string|max:100',
                'weapon_type' => 'nullable|string|max:100',
                'weapon_model' => 'nullable|string|max:100',
                'weapon_manufacturer' => 'nullable|string|max:150',
                'weapon_serial_number' => 'required|string|unique:weapon,weapon_serial_number|max:100',
                'weapon_weight' => 'nullable|numeric|min:0',
                'weapon_range' => 'nullable|integer|min:0',
            ]);

            // Validate resource data
            $resourceData['resource_category'] = 2;

            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Prepare data for insertion
            $data['authorized_by'] = auth()->id();
            $resourceData['resources_name'] = $data['weapon_name'];

            // Start database transaction
            DB::beginTransaction();
            try {
                // Insert weapon
                $weapon = $this->weaponService->addWeapon($data);
                if (!$weapon) {
                    throw new Exception("Failed to add weapon");
                }

                // Link resource to weapon
                $resourceData['weapon_id'] = $weapon->id;
                $resource = $this->resourceServices->addResource($resourceData);
                if (!$resource) {
                    throw new Exception("Failed to add resource");
                }

                // Commit transaction
                DB::commit();

                // Audit Log : created weapon
                Activity::causedBy(auth()->user())
                    ->performedOn($weapon)
                    ->withProperties([
                        'weapon_name' => $weapon->name,
                        'status' => $weapon->status,
                    ])
                    ->log('Weapon created');

                Activity::create([
                    'log_name' => 'weapon_creation',
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'role_id' => $user->role_id,
                    'description' => 'Weapon created with name: ' . $weapon->name,
                    'subject_type' => get_class($weapon),
                    'subject_id' => $weapon->id,
                    'causer_type' => get_class($user),
                    'causer_id' => $user->id,
                    'properties' => json_encode([
                        'additional_info' => 'Created weapon with price ' . $weapon->price
                    ])
                ]);

                return response()->json([
                    'message' => 'Weapon added successfully',
                    'weapon' => $weapon,
                    'resource' => $resource,
                ]);
            } catch (Exception $e) {
                // Rollback transaction on failure
                DB::rollback();
                return response()->json(['error' => $e->getMessage()], 500);
            }
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /* 
     * Function : updateWeapon
     * Description : Updates an existing weapon, validating the input and logging the update activity.
     * @param Request $request - The incoming HTTP request containing updated weapon data.
     * @param int $id - The ID of the weapon to be updated.
     * @return JsonResponse - Response indicating the success or failure of the weapon update.
     */
    public function updateWeapon(Request $request, $weaponId)
    {
        try {
            // Validate input data
            $data = $request->validate([
                'weapon_count' => 'nullable|integer|min:0',
            ]);

            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Update weapon
            $updatedWeapon = $this->weaponService->updateWeapon($data, $weaponId, auth()->id());
            if (!$updatedWeapon) {
                return response()->json(['error' => 'Failed to update weapon'], 500);
            }

            // Audit Log : updated weapon
            Activity::create([
                'log_name' => 'weapon_update',
                'user_name' => $user->name,
                'user_email' => $user->email,
                'role_id' => $user->role_id,
                'description' => 'Weapon updated with name: ' . $updatedWeapon->name,
                'subject_type' => get_class($updatedWeapon),
                'subject_id' => $updatedWeapon->id,
                'causer_type' => get_class($user),
                'causer_id' => $user->id,
                'properties' => json_encode([
                    'updated_fields' => $validatedData
                ])
            ]);

            return response()->json(['weapon' => $updatedWeapon]);

        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /* 
     * Function : deleteWeapon
     * Description : Deletes a weapon based on the given ID and logs the deletion activity.
     * @param int $id - The ID of the weapon to be deleted.
     * @return JsonResponse - Response indicating the success or failure of the weapon deletion.
     */
    public function deleteWeapon($weaponId)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Delete weapon
            $deletedWeapon = $this->weaponService->deleteWeapon($weaponId, auth()->id());
            if (!$deletedWeapon) {
                return response()->json(['error' => 'Failed to delete weapon'], 500);
            }
            
            // Audit Log : deleted weapon
            Activity::create([
                'log_name' => 'weapon_deletion',
                'user_name' => $user->name,
                'user_email' => $user->email,
                'role_id' => $user->role_id,
                'description' => 'Weapon deleted with ID: ' . $weaponId,
                'subject_type' => 'App\Models\Weapon',
                'subject_id' => $weaponId,
                'causer_type' => get_class($user),
                'causer_id' => $user->id,
                'properties' => json_encode([
                    'deleted_weapon_id' => $weaponId
                ])
            ]);

            return response()->json(['weapon' => $deletedWeapon]);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all weapons.
     */
    public function getAllWeapons()
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch all weapons
            $weapons = $this->weaponService->getAllWeapons(auth()->id());
            return response()->json($weapons);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get a weapon by name.
     */
    public function getWeaponByName($weaponName)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch weapon by name
            $weapon = $this->weaponService->getWeaponByName($weaponName, auth()->id());
            if (!$weapon) {
                return response()->json(['error' => 'Weapon not found'], 404);
            }

            return response()->json($weapon);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}
