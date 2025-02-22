<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Equipment;
use App\Services\ResourceServices;
use App\Services\EquipmentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Activitylog\Facades\Activity;
use Illuminate\Http\JsonResponse;

class EquipmentController extends Controller
{
    protected EquipmentService $equipmentService;
    protected ResourceServices $resourceServices;

    public function __construct(EquipmentService $equipmentService, ResourceServices $resourceServices)
    {
        $this->equipmentService = $equipmentService;
        $this->resourceServices = $resourceServices;
    }

    /**
     * Function : addEquipment
     * Description : Adds a new equipment, validates inputs, inserts into database, and logs activity.
     * @param Request $request
     * @return JsonResponse
     */
    public function addEquipment(Request $request)
    {
        try {
            // Validate equipment data
            $data = $request->validate([
                'equipment_name' => 'required|string|max:200',
                'equipment_description' => 'nullable|string',
                'equipment_count' => 'required|integer|min:1',
                'equipment_category' => 'nullable|string|max:200',
                'equipment_type' => 'nullable|string|max:200',
                'equipment_manufacturer' => 'nullable|string|max:200',
                'equipment_serial_number' => 'required|string|unique:equipment,equipment_serial_number|max:200',
            ]);

            // Validate resource data
            $resourceData['resource_category'] = 4; // Assuming category 4 is for equipment

            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Prepare data for insertion
            $data['authorized_by'] = auth()->id();
            $resourceData['resources_name'] = $data['equipment_name'];

            // Start database transaction
            DB::beginTransaction();
            try {
                // Insert equipment
                $equipment = $this->equipmentService->addEquipment($data);
                if (!$equipment) {
                    throw new Exception("Failed to add equipment");
                }

                // Link resource to equipment
                $resourceData['equipment_id'] = $equipment->id;
                $resource = $this->resourceServices->addResource($resourceData);
                if (!$resource) {
                    throw new Exception("Failed to add resource");
                }

                // Commit transaction
                DB::commit();

                // Audit Log : create equipment
                Activity::create([
                    'log_name' => 'equipment_creation',  
                    'user_id' => $user->id, 
                    'user_name' => $user->name,  
                    'user_email' => $user->email,  
                    'role_id' => $user->role_id,  
                    'description' => 'Equipment created with name: ' . $equipment->equipment_name,  
                    'subject_type' => get_class($equipment),  
                    'subject_id' => $equipment->id,  
                    'causer_type' => get_class($user),  
                    'causer_id' => $user->id, 
                    'properties' => json_encode([ 
                        'equipment_name' => $equipment->equipment_name,
                        'equipment_count' => $equipment->equipment_count,
                    ]),
                    'batch_uuid' => null,  
                    'created_at' => now(),  
                    'updated_at' => now(),  
                ]);
                

                return response()->json([
                    'message' => 'Equipment added successfully',
                    'equipment' => $equipment,
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
     * Function : updateEquipment
     * Description : Updates an existing equipment's details and logs activity.
     * @param Request $request
     * @param int $equipmentId
     * @return JsonResponse
     */
    public function updateEquipment(Request $request, $equipmentId)
    {
        try {
            // Validate input data
            $data = $request->validate([
                'equipment_count' => 'nullable|integer|min:1',
                'equipment_category' => 'nullable|string|max:200',
                'equipment_type' => 'nullable|string|max:200',
                'equipment_manufacturer' => 'nullable|string|max:200',
            ]);

            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            $equipment = Equipment::find($equipmentId); 
            // Update equipment
            $updatedEquipment = $this->equipmentService->updateEquipment($data, $equipmentId, auth()->id());
            if (!$updatedEquipment) {
                return response()->json(['error' => 'Failed to update equipment'], 500);
            }
        
            // Audit Log : update equipment
            Activity::create([
                'log_name' => 'equipment_creation',
                'user_id' => $user->id,  
                'user_name' => $user->name,  
                'user_email' => $user->email,  
                'role_id' => $user->role_id,
                'description' => 'Equipment created with name: ' . $equipment->equipment_name,
                'subject_type' => get_class($equipment),
                'subject_id' => $equipment->id,
                'causer_type' => get_class($user),
                'causer_id' => $user->id,
                'properties' => json_encode([
                    'equipment_name' => $equipment->equipment_name,
                    'equipment_count' => $equipment->equipment_count,
                ]),
                'batch_uuid' => null,  
                'created_at' => now(),  
                'updated_at' => now(),  
            ]);
            


            return response()->json(['equipment' => $updatedEquipment]);
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Function : deleteEquipment
     * Description : Deletes the specified equipment and logs activity.
     * @param int $equipmentId
     * @return JsonResponse
     */
    public function deleteEquipment($equipmentId)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            // Fetch the equipment object using the ID
           $equipment = $this->equipmentService->getEquipmentById($equipmentId);
           
            // Delete equipment
            $deletedEquipment = $this->equipmentService->deleteEquipment($equipmentId, auth()->id());
            if (!$deletedEquipment) {
                return response()->json(['error' => 'Failed to delete equipment'], 500);
            }

            // Audit Log : delete equipment
            Activity::create([
                'log_name' => 'equipment_deletion',
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'role_id' => $user->role_id,
                'description' => 'Equipment deleted with ID: ' . $equipmentId,
                'subject_type' => get_class($equipment),
                'subject_id' => $equipmentId,
                'causer_type' => get_class($user),
                'causer_id' => $user->id,
                'properties' => json_encode([
                    'equipment_name' => $equipment->equipment_name,
                ]),
                'batch_uuid' => null,  
                'created_at' => now(),  
                'updated_at' => now(),  
            ]);
            
            return response()->json(['equipment' => $deletedEquipment]);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Function : getAllEquipment
     * Description : Retrieves all equipment based on user authorization.
     * @return JsonResponse
     */
    public function getAllEquipment()
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch all equipment
            $equipment = $this->equipmentService->getAllEquipment(auth()->id());
            return response()->json($equipment);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Function : getEquipmentByName
     * Description : Retrieves equipment by its name based on user authorization.
     * @param string $equipmentName
     * @return JsonResponse
     */
    public function getEquipmentByName($equipmentName)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch equipment by name
            $equipment = $this->equipmentService->getEquipmentByName($equipmentName, auth()->id());
            if (!$equipment) {
                return response()->json(['error' => 'Equipment not found'], 404);
            }

            return response()->json($equipment);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}