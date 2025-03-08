<?php

namespace App\Services;

use App\Models\Operation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OperationService
{
    public function createOperation($data)
    {

        $operation = Operation::create($data);
        if ($operation) {
            return $operation;
        }

        return false;
    }

    public function updateOperation($id, $data, $userId)
    {
        $user = User::find($userId);
        if ($user->role_id == 1) {
            $operation = DB::selectOne('select * from operations o where o.created_by=? and o.id=?', [$userId, $id]);
            $operation = Operation::find($operation->id);

            $operation->updated_by = $userId;

            $operation->update($data);

            return $operation;
        } elseif ($user->role_id == 2 && $user->parent_id != null) {
            $userId = $user->parent_id;
            $operation = DB::selectOne('select * from operations o where o.created_by=? and o.id=?', [$userId, $id]);
            $operation = Operation::find($operation->id);
            $operation->updated_by = $user->id;
            $operation->update($data);

            return $operation;
        } elseif ($user->role_id == 3 && $user->parent_id != null) {
            $manager = User::find($user->parent_id);
            if ($manager && $manager->parent_id != null) {
                $userId = $manager->parent_id;
                $operation = DB::selectOne('select * from operations o where o.created_by=? and o.id=?', [$userId, $id]);
                $operation = Operation::find($operation->id);
                $operation->updated_by = $user->id;
                $operation->update($data);

                return $operation;
            }

            return false;
        }

        return false;
    }

    public function deleteOperation($id, $userId)
    {
        $operation = DB::selectOne('select * from operations o where o.created_by=? and o.id=?', [$userId, $id]);

        if ($operation) {
            $operation = Operation::find($operation->id);
            if ($operation->status == 'ongoing') {
                return false;
            }

            $operation->delete();

            return true;
        }

        return false;
    }

    public function getAllOperations($userId)
    {
        $user = User::where('id', $userId)->first();
        if ($user->role_id == 2 && $user->parent_id != null) {
            $user = User::find($user->parent_id);
            $userId = $user->id;
        }
        if ($user->role_id == 1 || ($user->parent_id == $userId && $user->role_id == 2)) {
            $operations = DB::select('select * from operations o where o.created_by=? ', [$userId]);

            return [count($operations), $operations];
        } elseif (($user->role_id == 3 || $user->role_id == 4) && $user->parent_id != null) {
            $user = User::find($user->parent_id);
            if($user->parent_id==null){
                return [0,[]];
            }
            $user = User::find($user->parent_id);
            $operations = DB::select('select * from operations o where o.created_by=? ', [$user->id]);

            return [count($operations), $operations];
        } else {
            return [0,[]];
        }
    }

    public function searchByName($name, $userId)
    {
        $user = User::where('id', $userId)->first();
        if ($user->role_id == 2 && $user->parent_id != null) {
            $user = User::find($user->parent_id);
            $userId = $user->id;
        }
        if ($user->role_id == 1 || ($user->parent_id == $userId && $user->role_id == 2)) {
            $operations = DB::select('select * from operations o where o.created_by=? and name Like  ?', [$userId,'%'.$name.'%']);

            return [count($operations), $operations];
        } elseif (($user->role_id == 3 || $user->role_id == 4) && $user->parent_id != null) {
            $user = User::find($user->parent_id);
            $user = User::find($user->parent_id);
            $operations = DB::select('select * from operations o where o.created_by=? and name Like  ?', [$userId,'%'.$name.'%']);

            return [count($operations), $operations];
        } else {
            return null;
        }

        
    }

    public function getOperationById($id)
    {
        return Operation::find($id);
    }
}
