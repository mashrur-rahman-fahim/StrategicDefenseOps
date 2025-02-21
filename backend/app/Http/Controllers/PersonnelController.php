<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Personnel;
use App\Services\ResourceServices;
use App\Services\PersonnelService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Activitylog\Facades\Activity;

class PersonnelController extends Controller
{
    protected PersonnelService $personnelService;
    protected ResourceServices $resourceServices;

    public function __construct(PersonnelService $personnelService, ResourceServices $resourceServices)
    {
        $this->personnelService = $personnelService;
        $this->resourceServices = $resourceServices;
    }

    /**
     * Add a new personnel.
     */
    public function addPersonnel(Request $request)
    {
        try {
            // Validate personnel data
            $data = $request->validate([
                'personnel_name' => 'required|string|max:200',
                'personnel_description' => 'nullable|string',
                'personnel_count' => 'required|integer|min:1',
                'personnel_category' => 'required|string|max:200',
                'personnel_type' => 'nullable|string|max:200',
                'personnel_rank' => 'nullable|string|max:200',
                'skills' => 'nullable|string|max:200',
                'personnel_serial_number' => 'required|string|unique:personnel,personnel_serial_number|max:200',
            ]);

            // Validate resource data
            $resourceData['resource_category'] = 3; // Assuming category 3 is for personnel

            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Prepare data for insertion
            $data['authorized_by'] = auth()->id();
            $resourceData['resources_name'] = $data['personnel_name'];

            // Start database transaction
            DB::beginTransaction();
            try {
                // Insert personnel
                $personnel = $this->personnelService->addPersonnel($data);
                if (!$personnel) {
                    throw new Exception("Failed to add personnel");
                }

                // Link resource to personnel
                $resourceData['personnel_id'] = $personnel->id;
                $resource = $this->resourceServices->addResource($resourceData);
                if (!$resource) {
                    throw new Exception("Failed to add resource");
                }

                // Commit transaction
                DB::commit();

                // Audit Log: Personnel added
                Activity::causedBy(auth()->user())
                    ->performedOn($personnel)
                    ->withProperties([
                        'personnel_name' => $personnel->personnel_name,
                        'personnel_count' => $personnel->personnel_count,
                    ])
                    ->log('Personnel added');

                return response()->json([
                    'message' => 'Personnel added successfully',
                    'personnel' => $personnel,
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
     * Update an existing personnel.
     */
    public function updatePersonnel(Request $request, $personnelId)
    {
        try {
            // Validate input data
            $data = $request->validate([
                'personnel_count' => 'nullable|integer|min:1',
                'personnel_rank' => 'nullable|string|max:200',
                'skills' => 'nullable|string|max:200',
            ]);

            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Update personnel
            $updatedPersonnel = $this->personnelService->updatePersonnel($data, $personnelId, auth()->id());
            if (!$updatedPersonnel) {
                return response()->json(['error' => 'Failed to update personnel'], 500);
            }

            // Audit Log : Personnel updated
            Activity::create([
                'log_name' => 'personnel_update',
                'user_name' => $user->name,
                'user_email' => $user->email,
                'role_id' => $user->role_id,
                'description' => 'Personnel updated with name: ' . $updatedPersonnel->personnel_name,
                'subject_type' => get_class($updatedPersonnel),
                'subject_id' => $updatedPersonnel->id,
                'causer_type' => get_class($user),
                'causer_id' => $user->id,
                'properties' => json_encode([
                    'updated_fields' => $data
                ])
            ]);

            return response()->json(['personnel' => $updatedPersonnel]);
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a personnel.
     */
    public function deletePersonnel($personnelId)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

           // Find the personnel to delete
        $personnel = $this->personnelService->findPersonnelById($personnelId);

        if (!$personnel) {
            return response()->json(['error' => 'Personnel not found'], 404);
        }

            // Delete personnel
            $deletedPersonnel = $this->personnelService->deletePersonnel($personnelId, auth()->id());
            if (!$deletedPersonnel) {
                return response()->json(['error' => 'Failed to delete personnel'], 500);
            }

            Activity::create([
                'log_name' => 'personnel_deletion',
                'user_name' => $user->name,
                'user_email' => $user->email,
                'role_id' => $user->role_id,
                'description' => 'Personnel deleted with name: ' . $personnel->personnel_name,
                'subject_type' => get_class($personnel),
                'subject_id' => $personnel->id,
                'causer_type' => get_class($user),
                'causer_id' => $user->id,
            ]);

            return response()->json(['personnel' => $deletedPersonnel]);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all personnel.
     */
    public function getAllPersonnel()
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch all personnel
            $personnel = $this->personnelService->getAllPersonnel(auth()->id());
            return response()->json($personnel);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get a personnel by name.
     */
    public function getPersonnelByName($personnelName)
    {
        try {
            // Check user authorization
            $user = User::find(auth()->id());
            if (!$user || $user->role_id > 2) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Fetch personnel by name
            $personnel = $this->personnelService->getPersonnelByName($personnelName, auth()->id());
            if (!$personnel) {
                return response()->json(['error' => 'Personnel not found'], 404);
            }

            return response()->json($personnel);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}