<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\OperationResourcesService;
use Illuminate\Http\Request;

class OperationResourcesController extends Controller
{
    //
    protected OperationResourcesService $operationResourcesService;

    public function __construct(OperationResourcesService $operationResourcesService)
    {
        $this->operationResourcesService = $operationResourcesService;
    }

    public function createOperationResource(Request $request, $operationId)
    {
        $data = $request->validate([
            'category' => 'required|array',
            'serial_number' => 'required|array',
            'count' => 'required|array',
        ]);
        $user = User::find(auth()->id());
        if (! $user || $user->role_id > 3) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $operationResource = $this->operationResourcesService->addOperationResources($data, $operationId, $user->id);
        if(!$operationResource){
            return response()->json(['error' => 'Failed to add operation resource'], 400);
        }
        return response()->json($operationResource, 201);
    }

    public function getAllOperationResources($operationId)
    {
        $user = User::find(auth()->id());
        
        $operationResources = $this->operationResourcesService->getOperationResource($operationId, $user->id);
        if(!$operationResources)
        {
            return response()->json(['error' => 'Operation resources not found'], 404);
        }
        return response()->json($operationResources);
    }

    public function updateOperationResource(Request $request, $operationId)
    {
        $data = $request->validate([
            'category' => 'required|array',
            'serial_number' => 'required|array',
            'count' => 'required|array',
        ]);
        $user = User::find(auth()->id());
        if (! $user || $user->role_id > 3) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $operationResource = $this->operationResourcesService->updateOperationResource($operationId, $user->id, $data);
        if(!$operationResource){
            return response()->json(['error' => 'Failed to update operation resource'], 400);
        }
        return response()->json($operationResource, 200);
    }
}
