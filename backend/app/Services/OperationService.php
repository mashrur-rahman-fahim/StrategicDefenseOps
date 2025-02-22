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
            $operation = DB::selectOne("select * from Operations o where o.created_by=? and o.id=?", [$userId, $id]);
            $operation = Operation::find($operation->id);

            $operation->updated_by = $userId;

            $operation->update($data);
            return $operation;
        } elseif ($user->role_id == 2 && $user->parent_id != null) {
            $userId = $user->parent_id;
            $operation = DB::selectOne("select * from Operations o where o.created_by=? and o.id=?", [$userId, $id]);
            $operation = Operation::find($operation->id);
            $operation->updated_by = $user->id;
            $operation->update($data);
        } elseif ($user->role_id == 3 && $user->parent_id != null) {
            $manager = User::find($user->parent_id);
            if ($manager && $manager->parent_id != null) {
                $userId = $manager->parent_id;
                $operation = DB::selectOne("select * from Operations o where o.created_by=? and o.id=?", [$userId, $id]);
                $operation = Operation::find($operation->id);
                $operation->updated_by = $user->id;
                $operation->update($data);
            }
            return false;
        }
        return false;
    }
    public function deleteOperation($id, $userId)
    {
        $operation = DB::selectOne("select * from Operations o where o.created_by=? and o.id=?", [$userId, $id]);

        if ($operation) {
            $operation->delete();
            return true;
        }
        return false;
    }
    public function getAllOperations($userId)
    {
        $user = User::where('id', $userId)->first();
        if ($user->role_id == 1 || ($user->parent_id == $userId && $user->role_id == 2)) {
            $operations = DB::select('select * from operations o where o.created_by=? ', [$userId]);
            return [count($operations), $operations];
        } elseif (($user->role_id == 3 || $user->role_id == 4) && $user->parent_id != null) {
            $user = User::find($user->parent_id);
            $user = User::find($user->parent_id);
            $operations = DB::select('select * from operations o where o.created_by=? ', [$user->id]);
            return [count($operations), $operations];
        } else {
            return null;
        }
    }
    public function searchByName($name, $userId)

    {
        $user = User::find($userId);
        $adminId = null;
        if ($user->role_id == 3 || $user->role_id == 4) {
            $user = User::find($user->parent_id);
            $user = User::find($user->parent_id);
            $adminId = $user->id;
        }
        $operations = DB::table('operations as o')
            ->join('users as u', 'u.id', '=', 'o.created_by')
            ->select('o.*', 'o.name as operation_name', 'u.*', 'u.name as user_name')
            ->where(function ($query) use ($userId, $adminId) {
                $query->where('u.parent_id', $userId)
                    ->orWhere('u.id', $userId)
                    ->orWhere('u.id', $adminId);
            })
            ->where('o.name', 'LIKE', '%' . $name . '%')->get();
        return [count($operations), $operations];
    }
    public function getOperationById($id)
    {
        return Operation::find($id);
    }
}
