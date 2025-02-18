<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\OperationResourcesService;
use App\Services\OperationService;
use DB;
use Exception;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    //
    protected OperationService $operationService;
    protected OperationResourcesService $operationResourcesService;
    public function __construct(OperationService $operationService, OperationResourcesService $operationResourcesService)
    {
        $this->operationService = $operationService;
        $this->operationResourcesService = $operationResourcesService;
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
        $usedResources = $request->validate([
            'serial_number' => 'required|array',
            'category' => 'required|array',
            'count' => 'required|array',
        ]);

        $validatedData['created_by'] = auth()->id();
        $validatedData['updated_by'] = auth()->id();
        $userId = auth()->id();
        $user = User::find($userId);
        if ($user && $user->role_id == 1) {
            DB::beginTransaction();
            try {
                $operation = $this->operationService->createOperation($validatedData);
                if (!$operation) {
                    throw new Exception('Could not create operation');
                }

                $resource = $this->operationResourcesService->addOperationResources($usedResources, $operation->id,auth()->id());
                if (!$resource) {
                    throw new Exception('Could not add resources to operation');
                }
                DB::commit();
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
        $updatedOperation = $this->operationService->updateOperation($id, $validatedData, auth()->id());
        return response()->json($updatedOperation, 200);
    }
    public function deleteOperation($id)
    {
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
