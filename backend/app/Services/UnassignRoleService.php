<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UnassignRoleService
{
    public function unassignRole(string $email, int $roleId, ?int $parentId = null): ?User
    {
        $tempUser = DB::selectOne('select * from users where email=? and parent_id=? ', [$email, $parentId]);
        $tempUser = User::find($tempUser->id);
        if (! $tempUser) {
            return null;
        }
        $query = User::where('email', $email)->where('role_id', $roleId);

        if ($parentId !== null) {
            $query->where('parent_id', $parentId);
        }

        $user = $query->first();

        if ($user) {
            $user->parent_id = null;
            $user->save();

            return $user;
        }

        return null;
    }
}
