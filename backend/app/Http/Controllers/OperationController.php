<?php

namespace App\Http\Controllers;

use App\Services\OperationService;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    //
    protected OperationService $operationService;
    public function __construct(OperationService $operationService){
        $this->operationService = $operationService;
    }
    public function createOperation(Request $request){
        $validatedData=$request->validate([
            'name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'status' => 'required|in:ongoing,upcoming,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'location' => 'nullable|string|max:200',
            'budget' => 'nullable|numeric',
        ]);
        $validatedData['created_by']=auth()->id();
        $validatedData['updated_by']=auth()->id();
        $operation = $this->operationService->createOperation($validatedData);
        return response()->json($operation, 201);
       
    }
}
