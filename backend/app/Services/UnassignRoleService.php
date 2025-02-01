<?php

namespace App\Services;

use App\Models\User;

class UnassignRoleService
{
    public function unassignRole(string $email, int $roleId, ?int $parentId = null)
    {
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
