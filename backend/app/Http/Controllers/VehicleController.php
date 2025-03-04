<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vehicle;
use App\Services\ResourceServices;
use App\Services\VehicleService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Activitylog\Facades\Activity;
use Illuminate\Http\JsonResponse;


class VehicleController extends Controller
{
    protected VehicleService $vehicleService;
    protected ResourceServices $resourceServices;

    public function __construct(VehicleService $vehicleService, ResourceServices $resourceServices)
    {
        $this->vehicleService = $vehicleService;
        $this->resourceServices = $resourceServices;
    }

    /**
     * Function : addVehicle
     * Description : Add a new vehicle to the system.
     * @param Request $request - Contains vehicle data for validation and insertion.
     * @return JsonResponse - Returns a response with success message and vehicle data or an error message.
     */
    public function addVehicle(Request $request)
    {
        try {
            // Validate vehicle data
            $data = $request->validate([
                'vehicle_name' => 'required|string|max:200',
                'vehicle_description' => 'nullable|string',
                'vehicle_count' => 'required|integer|min:1',
                'vehicle_type' => 'nullable|string|max:200',
                'vehicle_category' => 'nullable|string|max:200',
                'vehicle_model' => 'nullable|string|max:200',
                'vehicle_manufacturer' => 'nullable|string|max:200',
                'vehicle_serial_number' => 'required|string|unique:vehicle,vehicle_serial_number|max:200',
                'vehicle_capacity' => 'nullable|integer|min:0',
            ]);

            // Validate resource data
            $resourceData['resource_category'] = 1; // Assuming category 3 is for vehicles

            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Prepare data for insertion
            $data['authorized_by'] = auth()->id();
            $resourceData['resources_name'] = $data['vehicle_name'];

            // Start database transaction
            DB::beginTransaction();
            try {
                // Insert vehicle
                $vehicle = $this->vehicleService->addVehicle($data);
                if (!$vehicle) {
                    throw new Exception("Failed to add vehicle");
                }

                // Link resource to vehicle
                $resourceData['vehicle_id'] = $vehicle->id;
                $resource = $this->resourceServices->addResource($resourceData);
                if (!$resource) {
                    throw new Exception("Failed to add resource");
                }

                // Commit transaction
                DB::commit();

                // Audit Log : vehicle creation
                activity()
                    ->performedOn($vehicle)
                    ->causedBy($user)
                    ->tap(function ($activity) use ($user, $vehicle) {
                        $activity->log_name = "vehicle_creation";
                        $activity->user_id = $user->id;
                        $activity->user_name = $user->name;
                        $activity->user_email = $user->email;
                        $activity->role_id = $user->role_id;
                        $activity->description = "Vehicle created with name: " . $vehicle->vehicle_name;
                        $activity->subject_id = $vehicle->id;
                        $activity->subject_type = get_class($vehicle);
                        $activity->causer_id = $user->id;
                        $activity->causer_type = get_class($user);
                    })
                    ->withProperties([
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'user_email' => $user->email,
                        'role_id' => $user->role_id,
                        'vehicle_id' => $vehicle->id,
                        'vehicle_name' => $vehicle->vehicle_name,
                        'vehicle_count' => $vehicle->vehicle_count,
                        'vehicle_capacity' => $vehicle->vehicle_capacity
                    ])
                    ->log('Vehicle Created');


                return response()->json([
                    'message' => 'Vehicle added successfully',
                    'vehicle' => $vehicle,
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
     * Function : updateVehicle
     * Description : Update an existing vehicle.
     * @param Request $request - Contains updated vehicle data.
     * @param int $vehicleId - The ID of the vehicle to be updated.
     * @return JsonResponse - Returns updated vehicle data or an error message.
     */
    public function updateVehicle(Request $request, $vehicleId)
    {
        try {
            // Validate input data
            $data = $request->validate([
                'vehicle_name' => 'required|string|max:200',
                'vehicle_description' => 'nullable|string',
                'vehicle_count' => 'required|integer|min:1',
                'vehicle_type' => 'nullable|string|max:200',
                'vehicle_category' => 'nullable|string|max:200',
                'vehicle_model' => 'nullable|string|max:200',
                'vehicle_manufacturer' => 'nullable|string|max:200',
                'vehicle_capacity' => 'nullable|integer|min:0',
            ]);

            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Update vehicle
            $updatedVehicle = $this->vehicleService->updateVehicle($data, $vehicleId, auth()->id());
            if (!$updatedVehicle) {
                return response()->json(['error' => 'Failed to update vehicle'], 500);
            }

            // Audit Log : vehicle update
            activity()
                ->performedOn($updatedVehicle)
                ->causedBy($user)
                ->tap(function ($activity) use ($user, $updatedVehicle, $data) {
                    $activity->log_name = "vehicle_update";
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->description = "Vehicle updated with name: " . $updatedVehicle->vehicle_name;
                    $activity->subject_id = $updatedVehicle->id;
                    $activity->subject_type = get_class($updatedVehicle);
                    $activity->causer_id = $user->id;
                    $activity->causer_type = get_class($user);
                })
                ->withProperties([
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'role_id' => $user->role_id,
                    'vehicle_id' => $updatedVehicle->id,
                    'vehicle_name' => $updatedVehicle->vehicle_name,
                    'vehicle_count' => $updatedVehicle->vehicle_count,
                    'vehicle_capacity' => $updatedVehicle->vehicle_capacity,
                    'updated_fields' => $data // Assuming $data contains the fields that were updated
                ])
                ->log('Vehicle Updated');


            return response()->json(['vehicle' => $updatedVehicle]);
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }


    /** 
     * Function : deleteVehicle
     * Description : Delete a vehicle.
     * @param int $vehicleId - The ID of the vehicle to be deleted.
     * @return JsonResponse - Returns success message or an error message.
     */
    public function deleteVehicle($vehicleId)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Delete vehicle
            $deletedVehicle = $this->vehicleService->deleteVehicle($vehicleId, auth()->id());
            if (!$deletedVehicle) {
                return response()->json(['error' => 'Failed to delete vehicle'], 500);
            }

            // Audit Log : vehicle deletion 
            activity()
                ->performedOn(new Vehicle())
                ->causedBy($user)
                ->tap(function ($activity) use ($user, $vehicleId) {
                    $activity->log_name = "vehicle_deletion";
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->description = "Vehicle deleted with ID: " . $vehicleId;
                    $activity->subject_id = $vehicleId;
                    $activity->subject_type = Vehicle::class;
                    $activity->causer_id = $user->id;
                    $activity->causer_type = get_class($user);
                })
                ->withProperties([
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'role_id' => $user->role_id,
                    'vehicle_id' => $vehicleId
                ])
                ->log('Vehicle Deleted');




            return response()->json(['vehicle' => $deletedVehicle]);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }


    /**
     * Function : getAllVehicles
     * Description : Get all vehicles.
     * @return JsonResponse - Returns a list of all vehicles.
     */
    public function getAllVehicles()
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch all vehicles
            $vehicles = $this->vehicleService->getAllVehicles(auth()->id());
            return response()->json($vehicles);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }


    /** 
     * Function : getVehicleByName
     * Description : Get a vehicle by name.
     * @param string $vehicleName - The name of the vehicle to fetch.
     * @return JsonResponse - Returns the vehicle data or an error message if not found.
     */
    public function getVehicleByName($vehicleName)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch vehicle by name
            $vehicle = $this->vehicleService->getVehicleByName($vehicleName, auth()->id());
            if (!$vehicle) {
                return response()->json(['error' => 'Vehicle not found'], 404);
            }

            return response()->json($vehicle);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}
