<?php

namespace App\Services;
use App\Models\Operation;
use App\Models\User;
use DB;

class OperationService{
    public function createOperation($data){
       
      
            $operation= Operation::create($data);
            if($operation){
                return $operation;
            }
    
        return false;
        
    }
    public function updateOperation($id,$data,$userId){
            $operation=Operation::find($id);
            $user=User::where('id',$userId)->first();
            if($operation && ($user->role_id==1 || $user->role_id==2)){
                $operation->updated_by=$userId;
        
                $operation->update($data);
                return [$operation];
            }
            return false;
    }
    public function deleteOperation($id,$userId){
        $operation=Operation::find($id);
        $user=User::where('id',$userId)->first();
        if($operation && ($user->role_id==1 || $user->role_id==2)){
            $operation->delete();
            return true;
        }
        return false;
    }
    public function getAllOperations($userId){
        $user=User::where('id',$userId)->first();
        if($user->role_id==1){
        $operations=DB::select('select * from operations o where o.created_by=? ',[$userId]);
                        return [count($operations),$operations];}
                        else {return null;}
        
    }
    public function searchByName($name,$userId){
        $operations=DB::table('operations as o')
        ->join('users as u','u.id','=','o.created_by')
        ->select('o.*','o.name as operation_name','u.*','u.name as user_name')
        ->where(function($query) use ($userId){
                $query->where('u.parent_id',$userId)
                ->orWhere('u.id',$userId);
        })
        ->where('o.name','LIKE','%'.$name.'%')->get();
        return [count($operations),$operations];
    }
    
}