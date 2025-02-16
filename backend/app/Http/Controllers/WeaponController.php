<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Weapon;
use App\Services\ResourceServices;
use App\Services\WeaponService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WeaponController extends Controller
{
    protected WeaponService $weaponService;
    protected ResourceServices $resourceServices;

    public function __construct(WeaponService $weaponService, ResourceServices $resourceServices)
    {
        $this->weaponService = $weaponService;
        $this->resourceServices = $resourceServices;
    }

    /**
     * Add a new weapon.
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
            $resourceData = $request->validate([
                'resource_category' => 'required|integer|min:1|max:4'
            ]);

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

    /**
     * Update an existing weapon.
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
            $updatedWeapon = $this->weaponService->updateWeapon($data, $weaponId);
            if (!$updatedWeapon) {
                return response()->json(['error' => 'Failed to update weapon'], 500);
            }

            return response()->json(['weapon' => $updatedWeapon]);
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a weapon.
     */
    public function deleteWeapon($id)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Delete weapon
            $deletedWeapon = $this->weaponService->deleteWeapon($id);
            if (!$deletedWeapon) {
                return response()->json(['error' => 'Failed to delete weapon'], 500);
            }

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
            $weapons = $this->weaponService->getAllWeapons();
            return response()->json($weapons);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get a weapon by name.
     */
    public function getWeaponByName($name)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch weapon by name
            $weapon = $this->weaponService->getWeaponByName($name);
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