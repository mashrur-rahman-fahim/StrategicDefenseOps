<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\OperationService;
use DB;
use Exception;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    //
    protected OperationService $operationService;

    public function __construct(OperationService $operationService)
    {
        $this->operationService = $operationService;
       
    }
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
        return response()->json($updatedOperation, 200);
    }
    public function deleteOperation($id)
    {
        $user=User::find(auth()->id());
        if(!$user || $user->role_id!=1){
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $message = $this->operationService->deleteOperation($id, auth()->id());
        if ($message) {
            return response()->json(['message' => 'deleted successfully'], 200);
        }
        return response()->json(['message' => 'failed to delete'], 400);
    }
    public function getAllOperations()
    {
        
        $operations = $this->operationService->getAllOperations(auth()->id());
        if ($operations) {
            return response()->json($operations, 200);
        } else {
            return response()->json(['message' => 'not found'], 404);
        }
    }
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
