<?php

namespace App\Services;
use App\Models\Operation;
use App\Models\User;

class OperationService{
    public function createOperation($data,$parentId){
        $user=User::where('id',$parentId)->first();
        if($parentId && ($user->role_id==1 )){
            return Operation::create($data);
        }
        return ['message'=>'failed to create operation'];
        
    }
    public function updateOperation($id,$data,$parentId){
            $operation=Operation::find($id);
            $user=User::where('id',$parentId)->first();
            if($operation && ($user->role_id==1 || $user->role_id==2)){
                $operation->updated_by=$parentId;
        
                $operation->update($data);
                return [$operation];
            }
            return ['message'=> 'update operation failed'];
    }
    
}