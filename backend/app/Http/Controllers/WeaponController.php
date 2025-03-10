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
use Spatie\Activitylog\Facades\Activity;

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
            if (! $user || $user->role_id !== 1) {
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
                if (! $weapon) {
                    throw new Exception('Failed to add weapon');
                }

                // Link resource to weapon
                $resourceData['weapon_id'] = $weapon->id;
                $resource = $this->resourceServices->addResource($resourceData);
                if (! $resource) {
                    throw new Exception('Failed to add resource');
                }

                // Commit transaction
                DB::commit();

                // Audit Log : created weapon
                activity()
                    ->performedOn($weapon)
                    ->causedBy($user)
                    ->tap(function ($activity) use ($user, $weapon) {
                        $activity->log_name = 'weapon_creation';
                        $activity->user_id = $user->id;
                        $activity->user_name = $user->name;
                        $activity->user_email = $user->email;
                        $activity->role_id = $user->role_id;
                        $activity->description = 'Weapon created with name: '.$weapon->name;
                        $activity->subject_id = $weapon->id;
                        $activity->subject_type = get_class($weapon);
                        $activity->causer_id = $user->id;
                        $activity->causer_type = get_class($user);
                    })
                    ->withProperties([
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                        'role_id' => $user->role_id,
                        'weapon_name' => $weapon->name,
                        'weapon_id' => $weapon->id,
                        'weapon_price' => $weapon->price,
                        'additional_info' => 'Created weapon with price '.$weapon->price,
                    ])
                    ->log('Weapon Created');

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
            return response()->json(['error' => 'An unexpected error occurred: '.$e->getMessage()], 500);
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
                'weapon_name' => 'required|string|max:255',
                'weapon_description' => 'nullable|string',
                'weapon_count' => 'required|integer|min:1',
                'weapon_category' => 'nullable|string|max:100',
                'weapon_type' => 'nullable|string|max:100',
                'weapon_model' => 'nullable|string|max:100',
                'weapon_manufacturer' => 'nullable|string|max:150',
                'weapon_weight' => 'nullable|numeric|min:0',
                'weapon_range' => 'nullable|integer|min:0',
            ]);

            // Check user authorization
            $user = User::find(auth()->id());
            if (! $user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Update weapon
            $updatedWeapon = $this->weaponService->updateWeapon($data, $weaponId, auth()->id());
            if (! $updatedWeapon) {
                return response()->json(['error' => 'Failed to update weapon'], 500);
            }

            // Audit Log : updated weapon
            activity()
                ->performedOn($updatedWeapon)
                ->causedBy($user)
                ->tap(function ($activity) use ($user, $updatedWeapon) {
                    $activity->log_name = 'weapon_update';
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->description = 'Weapon updated with name: '.$updatedWeapon->name;
                    $activity->subject_id = $updatedWeapon->id;
                    $activity->subject_type = get_class($updatedWeapon);
                    $activity->causer_id = $user->id;
                    $activity->causer_type = get_class($user);
                })
                ->withProperties([
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'role_id' => $user->role_id,
                    'weapon_id' => $updatedWeapon->id,
                    'weapon_name' => $updatedWeapon->name,
                    'updated_fields' => $data,
                ])
                ->log('Weapon Updated');

            return response()->json(['weapon' => $updatedWeapon]);
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: '.$e->getMessage()], 500);
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
            if (! $user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Delete weapon
            $deletedWeapon = $this->weaponService->deleteWeapon($weaponId, auth()->id());
            if (! $deletedWeapon) {
                return response()->json(['error' => 'Failed to delete weapon'], 500);
            }

            // Audit Log : deleted weapon
            activity()
                ->performedOn(new Weapon)
                ->causedBy($user)
                ->tap(function ($activity) use ($user, $weaponId) {
                    $activity->log_name = 'weapon_deletion';
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->description = 'Weapon deleted with ID: '.$weaponId;
                    $activity->subject_id = $weaponId;
                    $activity->subject_type = 'App\Models\Weapon';
                    $activity->causer_id = $user->id;
                    $activity->causer_type = get_class($user);
                })
                ->withProperties([
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'role_id' => $user->role_id,
                    'deleted_weapon_id' => $weaponId,
                ])
                ->log('Weapon Deleted');

            return response()->json(['weapon' => $deletedWeapon]);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: '.$e->getMessage()], 500);
        }
    }
}
