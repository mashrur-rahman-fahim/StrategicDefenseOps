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
        
        $operation = $this->operationService->createOperation($validatedData,auth()->id());
        return response()->json($operation, 201);
       
    }
    public function updateOperation(Request $request,$id){
        $validatedData=$request->validate([
            'name'=>'nullable|string|max:200',
            'description'=>'nullable|string',
           'status'=>'nullable|in:ongoing,upcoming,completed',
           'start_date'=>'nullable|date',
           'end_date'=>'nullable|date',
           'location'=>'nullable|string|max:200',
           'budget'=>'nullable|numeric',
        ]);
        $updatedOperation = $this->operationService->updateOperation($id,$validatedData,auth()->id());
        return response()->json($updatedOperation, 200);
    }
    public function deleteOperation($id){
        $message=$this->operationService->deleteOperation($id,auth()->id());
        if($message){
            return response()->json(['message'=> 'deleted successfully'],200);
        }
        return response()->json(['message'=> 'failed to delete'],400);
    }
    public function getAllOperations(){
        $operations=$this->operationService->getAllOperations(auth()->id());
        if($operations){
        return response()->json($operations, 200);}
        else {return response() ->json(['message'=> 'not found'],404);}
    }
}
