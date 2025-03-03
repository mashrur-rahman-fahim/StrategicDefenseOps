<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class RoleViewService
{
    public function upView($user)
    {
        if ($user->parent_id == null) {
            return false;
        }
        $upperRole = User::find($user->parent_id);
        return $upperRole; // Return the object directly
    }

    public function downView($user, $roleId)
    {
        return DB::select("select * from users where parent_id=? and role_id=?", [$user->id, $roleId]);
    }
}