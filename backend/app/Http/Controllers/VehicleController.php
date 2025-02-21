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
     * Add a new vehicle.
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
                Activity::create([
                    'log_name' => 'vehicle_creation',
                    'user_name' => $user->name,
                    'user_email' => $user->email,
                    'role_id' => $user->role_id,
                    'description' => 'Vehicle created with name: ' . $vehicle->vehicle_name,
                    'subject_type' => get_class($vehicle),
                    'subject_id' => $vehicle->id,
                    'causer_type' => get_class($user),
                    'causer_id' => $user->id,
                    'properties' => json_encode([
                        'vehicle_count' => $vehicle->vehicle_count,
                        'vehicle_capacity' => $vehicle->vehicle_capacity,
                    ])
                ]);

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
     * Update an existing vehicle.
     */
    public function updateVehicle(Request $request, $vehicleId)
    {
        try {
            // Validate input data
            $data = $request->validate([
                'vehicle_count' => 'nullable|integer|min:0',
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
     * Delete a vehicle.
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

            // Audit Log : vehicle deletion ------------------------------------------
            

            return response()->json(['vehicle' => $deletedVehicle]);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all vehicles.
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
     * Get a vehicle by name.
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