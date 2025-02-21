<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\OperationService;
use DB;
use Exception;
use Illuminate\Http\Request;
use Spatie\Activitylog\Facades\Activity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;


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
     * @param Request $request - The incoming HTTP request containing the operation data.
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
                if (!$operation) {
                    throw new Exception('Could not create operation');
                }

                // Audit Log : created operation 
                Activity::causedBy(auth()->user()) 
                    ->performedOn($operation)
                    ->withProperties([
                        'operation_name' => $operation->name,
                        'status' => $operation->status,
                    ])
                    ->log('Operation created');
                
                Activity::create([
                    'log_name' => 'operation_creation', 
                    'user_name' => $user->name, 
                    'user_email' => $user->email, 
                    'role_id' => $user->role_id, 
                    'description' => 'Operation created with name: ' . $operation->name,
                    'subject_type' => get_class($operation),
                    'subject_id' => $operation->id,
                    'causer_type' => get_class($user), 
                    'causer_id' => $user->id,
                    'properties' => json_encode([
                        'additional_info' => 'Created operation with budget ' . $operation->budget
                    ])
                ]);



                return response()->json([
                    'message' => 'Operation created successfully',
                    $operation
                ], 200);


            } catch (Exception $e) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Failed to create operation',
                    $e->getMessage()
                ], 201);
            }
        }

        return response()->json(
            [
                'message' => 'Failed to create operation',
            ]
            ,
            201
        );

    }
    
   /** 
     * Function : updateOperation
     * Description : Updates an existing operation, validating the input and logging the update activity.
     * @param Request $request - The incoming HTTP request containing updated operation data.
     * @param int $id - The ID of the operation to be updated.
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
        $user=User::find(auth()->id());
        if (!$user || $user->role_id > 3) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
      
        $updatedOperation = $this->operationService->updateOperation($id, $validatedData, auth()->id());
        if (!$updatedOperation) {
            return response()->json(['error' => 'Failed to update operation'], 500);

        }
        // Audit Log : updated operation 
        Activity::create([
            'log_name' => 'operation_update', 
            'user_name' => $user->name,
            'user_email' => $user->email,
            'role_id' => $user->role_id,
            'description' => 'Operation updated with name: ' . $updatedOperation->name,
            'subject_type' => get_class($updatedOperation), 
            'subject_id' => $updatedOperation->id,
            'causer_type' => get_class($user), 
            'causer_id' => $user->id,
            'properties' => json_encode([
                'updated_fields' => $validatedData
            ])
        ]);

        return response()->json($updatedOperation, 200);
    }

   /** 
     * Function : deleteOperation
     * Description : Deletes an operation based on the given ID and logs the deletion activity.
     * @param int $id - The ID of the operation to be deleted.
     * @return JsonResponse - Response indicating the success or failure of the operation deletion.
     */
    public function deleteOperation($id)
    {
        $user=User::find(auth()->id());
        if(!$user || $user->role_id!=1){
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $message = $this->operationService->deleteOperation($id, auth()->id());
        if ($message) {
            // Audit Log : deleted operation 
            Activity::create([
                'log_name' => 'operation_deletion',
                'user_name' => $user->name,
                'user_email' => $user->email,
                'role_id' => $user->role_id,
                'description' => 'Operation deleted with ID: ' . $id,
                'subject_type' => 'App\Models\Operation', 
                'subject_id' => $id,
                'causer_type' => get_class($user), 
                'causer_id' => $user->id,
                'properties' => json_encode([
                    'deleted_operation_id' => $id
                ])
            ]);

            return response()->json(['message' => 'deleted successfully'], 200);
        }
        return response()->json(['message' => 'failed to delete'], 400);
    }

    /** 
     * Function : getAllOperations
     * Description : Fetches all operations for the authenticated user.
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
     * @param string $name - The name to search for in the operation records.
     * @return JsonResponse - List of operations that match the given name.
     */
    public function searchByName($name)
    {
        $user = User::find(auth()->id());

        if ($user->role_id == 1) {
            $operations = $this->operationService->searchByName($name, auth()->id());
            return response()->json($operations, 200);
        }
        return response()->json(['message' => 'not found'], 404);
    }
}
