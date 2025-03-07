<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\OperationService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Facades\Activity;

class OperationController extends Controller
{
    protected OperationService $operationService;

    public function __construct(OperationService $operationService)
    {
        $this->operationService = $operationService;
    }

    /**
     * Function : createOperation
     * Description : Creates a new operation in the system, validates input, and logs the activity.
     *
     * @param  Request  $request  - The incoming HTTP request containing the operation data.
     * @return JsonResponse - Response indicating the success or failure of operation creation.
     */
    public function createOperation(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'status' => 'required|in:ongoing,upcoming,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'location' => 'nullable|string|max:200',
            'budget' => 'nullable|numeric',

        ]);

        $validatedData['created_by'] = auth()->id();
        $validatedData['updated_by'] = auth()->id();
        $userId = auth()->id();
        $user = User::find($userId);
        if ($user && $user->role_id == 1) {

            try {
                $operation = $this->operationService->createOperation($validatedData);
                if (! $operation) {
                    throw new Exception('Could not create operation');
                }

                // Audit Log : created operation
                activity()
                    ->causedBy($user)
                    ->performedOn($operation)
                    ->tap(function ($activity) use ($user, $operation) {
                        $activity->log_name = 'operation_creation';
                        $activity->user_id = $user->id;
                        $activity->user_name = $user->name;
                        $activity->user_email = $user->email;
                        $activity->role_id = $user->role_id;
                        $activity->description = 'Operation created with name: '.$operation->name;
                        $activity->subject_type = get_class($operation);
                        $activity->subject_id = $operation->id;
                        $activity->causer_type = get_class($user);
                        $activity->causer_id = $user->id;
                        $activity->event = 'Operation Created';
                        $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                        $activity->created_at = now();
                        $activity->updated_at = now();
                    })
                    ->withProperties([
                        'operation_name' => $operation->name,
                        'status' => $operation->status,
                        'budget' => $operation->budget,
                        'timestamp' => now()->toDateTimeString(),
                    ])
                    ->log('Operation created: '.$operation->name);

                return response()->json([
                    'message' => 'Operation created successfully',
                    $operation,
                ], 200);
            } catch (Exception $e) {
                DB::rollBack();

                return response()->json([
                    'message' => 'Failed to create operation',
                    $e->getMessage(),
                ], 201);
            }
        }

        return response()->json(
            [
                'message' => 'Failed to create operation',
            ],
            201
        );
    }

    /**
     * Function : updateOperation
     * Description : Updates an existing operation, validating the input and logging the update activity.
     *
     * @param  Request  $request  - The incoming HTTP request containing updated operation data.
     * @param  int  $id  - The ID of the operation to be updated.
     * @return JsonResponse - Response indicating the success or failure of the operation update.
     */
    public function updateOperation(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'status' => 'nullable|in:ongoing,upcoming,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'location' => 'nullable|string|max:200',
            'budget' => 'nullable|numeric',
        ]);
        $user = User::find(auth()->id());
        if (! $user || $user->role_id > 3) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // $operation = $this->operationService->updateOperation($id, $validatedData, $user->id);

        $updatedOperation = $this->operationService->updateOperation($id, $validatedData, auth()->id());
        if (! $updatedOperation) {
            return response()->json(['error' => 'Failed to update operation'], 500);
        }
        // Audit Log : updated operation
        // activity()
        //     ->causedBy($user)
        //     ->performedOn($operation)
        //     ->tap(function ($activity) use ($user, $operation, $validatedData) {
        //         $activity->log_name = 'operation_update';
        //         $activity->user_id = $user->id;
        //         $activity->user_name = $user->name;
        //         $activity->user_email = $user->email;
        //         $activity->role_id = $user->role_id;
        //         $activity->description = 'Operation updated: ' . $operation->name;
        //         $activity->subject_type = get_class($operation);
        //         $activity->subject_id = $operation->id;
        //         $activity->causer_type = get_class($user);
        //         $activity->causer_id = $user->id;
        //         $activity->event = 'Operation Updated';
        //         $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
        //         $activity->created_at = now();
        //         $activity->updated_at = now();
        //     })
        //     ->withProperties([
        //         'updated_fields' => $validatedData,
        //         'operation_name' => $operation->name,
        //         'status' => $operation->status,
        //         'budget' => $operation->budget,
        //         'timestamp' => now()->toDateTimeString(),
        //     ])
        //     ->log('Operation updated: ' . $operation->name);

        return response()->json($updatedOperation, 200);
    }

    /**
     * Function : deleteOperation
     * Description : Deletes an operation based on the given ID and logs the deletion activity.
     *
     * @param  int  $id  - The ID of the operation to be deleted.
     * @return JsonResponse - Response indicating the success or failure of the operation deletion.
     */
    public function deleteOperation($id)
    {
        $user = User::find(auth()->id());
        if (! $user || $user->role_id != 1) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $operation = $this->operationService->getOperationById($id);
        $message = $this->operationService->deleteOperation($id, auth()->id());
        if ($message) {

            // Audit Log : deleted operation
            activity()
                ->causedBy($user)
                ->performedOn($operation)
                ->tap(function ($activity) use ($user, $operation) {
                    $activity->log_name = 'operation_deletion';
                    $activity->user_id = $user->id;
                    $activity->user_name = $user->name;
                    $activity->user_email = $user->email;
                    $activity->role_id = $user->role_id;
                    $activity->description = 'Operation deleted: '.$operation->name;
                    $activity->subject_type = get_class($operation);
                    $activity->subject_id = $operation->id;
                    $activity->causer_type = get_class($user);
                    $activity->causer_id = $user->id;
                    $activity->event = 'Operation Deleted';
                    $activity->batch_uuid = \Illuminate\Support\Str::uuid()->toString();
                    $activity->created_at = now();
                    $activity->updated_at = now();
                })
                ->withProperties([
                    'operation_name' => $operation->name,
                    'status' => $operation->status,
                    'budget' => $operation->budget,
                    'timestamp' => now()->toDateTimeString(),
                ])
                ->log('Operation deleted: '.$operation->name);

            return response()->json(['message' => 'deleted successfully'], 200);
        }

        return response()->json(['message' => 'failed to delete'], 400);
    }

    /**
     * Function : getAllOperations
     * Description : Fetches all operations for the authenticated user.
     *
     * @return JsonResponse - List of all operations associated with the user.
     */
    public function getAllOperations()
    {

        $operations = $this->operationService->getAllOperations(auth()->id());
        if ($operations) {
            return response()->json($operations, 200);
        } else {
            return response()->json(['message' => 'not found'], 404);
        }
    }

    /**
     * Function : searchByName
     * Description : Searches for operations by name based on the user's role.
     *
     * @param  string  $name  - The name to search for in the operation records.
     * @return JsonResponse - List of operations that match the given name.
     */
    public function searchByName($name)
    {
      

       
            $operations = $this->operationService->searchByName($name, auth()->id());
            if ($operations) {
                return response()->json($operations, 200);
            } else {
                return response()->json(['message' => 'not found'], 404);
            }

          
       

    }
}
