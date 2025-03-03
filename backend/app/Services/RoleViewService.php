<?php
namespace App\Services;

use App\Models\User;
use DB;

class RoleViewService{
   public function upView($user){
    if($user->parent_id==null){
        return false;
    }
        $upperRole=User::find($user->parent_id);
        return [count($upperRole),$upperRole];
   }
   public function downView($user , $roleId){
    $downRoles=DB::select("select * from users where parent_id=? and role_id=?",[$user->id,$roleId]);
    return [count($downRoles),$downRoles];
   }
}