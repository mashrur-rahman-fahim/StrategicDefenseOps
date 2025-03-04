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
use Illuminate\Http\JsonResponse;

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
     * Function : addPersonnel
     * Description : Add a new personnel along with a linked resource.
     * @param Request $request - The incoming request containing personnel data.
     * @return JsonResponse - The response containing the added personnel and resource or an error message.
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
                activity()
                    ->causedBy($user)
                    ->performedOn($personnel)
                    ->tap(function ($activity) use ($user, $personnel) {
                        $activity->log_name = 'personnel_created';
                        $activity->user_id = $user->id;
                        $activity->user_name = $user->name;
                        $activity->user_email = $user->email;
                        $activity->role_id = $user->role_id;
                        $activity->description = 'Personnel added with name: ' . $personnel->personnel_name;
                        $activity->subject_type = get_class($personnel);
                        $activity->subject_id = $personnel->id;
                        $activity->causer_type = get_class($user);
                        $activity->causer_id = $user->id;
                        $activity->event = 'created';
                        $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                        $activity->created_at = now();
                        $activity->updated_at = now();
                    })
                    ->withProperties([
                        'personnel_name' => $personnel->personnel_name,
                        'personnel_count' => $personnel->personnel_count,
                        'timestamp' => now()->toDateTimeString(),
                    ])
                    ->log('Personnel added: ' . $personnel->personnel_name);




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
     * Function : updatePersonnel
     * Description : Update an existing personnel's data.
     * @param Request $request - The incoming request containing updated personnel data.
     * @param int $personnelId - The ID of the personnel to be updated.
     * @return JsonResponse - The response containing the updated personnel data or an error message.
     */
    public function updatePersonnel(Request $request, $personnelId)
    {
        try {
            // Validate input data
            $data = $request->validate([
                'personnel_name' => 'required|string|max:200',
                'personnel_description' => 'nullable|string',
                'personnel_count' => 'required|integer|min:1',
                'personnel_category' => 'required|string|max:200',
                'personnel_type' => 'nullable|string|max:200',
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

            // Audit Log: Personnel updated
            activity()
                ->causedBy($user)
                ->performedOn($updatedPersonnel)
                ->tap(function ($activity) use ($user, $updatedPersonnel, $data) {
                    $activity->log_name = 'personnel_update';
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->description = 'Personnel updated with name: ' . $updatedPersonnel->personnel_name;
                    $activity->subject_type = get_class($updatedPersonnel);
                    $activity->subject_id = $updatedPersonnel->id;
                    $activity->causer_type = get_class($user);
                    $activity->causer_id = $user->id;
                    $activity->event = 'updated';
                    $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'updated_fields' => $data,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log('Personnel updated: ' . $updatedPersonnel->personnel_name);




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
     * Function : deletePersonnel
     * Description : Delete a personnel from the database.
     * @param int $personnelId - The ID of the personnel to be deleted.
     * @return JsonResponse - The response containing the deleted personnel or an error message.
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

            // Audit Log : Personnel deleted
            activity()
                ->causedBy($user)
                ->performedOn($personnel)
                ->tap(function ($activity) use ($user, $personnel) {
                    $activity->log_name = 'personnel_deletion';
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->description = 'Personnel deleted with name: ' . $personnel->personnel_name;
                    $activity->subject_type = get_class($personnel);
                    $activity->subject_id = $personnel->id;
                    $activity->causer_type = get_class($user);
                    $activity->causer_id = $user->id;
                    $activity->event = 'deleted';
                    $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'deleted_personnel' => $personnel->personnel_name,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log('Personnel deleted: ' . $personnel->personnel_name);



            return response()->json(['personnel' => $deletedPersonnel]);
        } catch (Exception $e) {
            // Handle unexpected errors
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }


    /**
     * Function : getAllPersonnel
     * Description : Retrieve all personnel from the database.
     * @return JsonResponse - The response containing a list of all personnel or an error message.
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
     * Function : getPersonnelByName
     * Description : Retrieve personnel by their name.
     * @param string $personnelName - The name of the personnel to search for.
     * @return JsonResponse - The response containing the personnel data or an error message.
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
