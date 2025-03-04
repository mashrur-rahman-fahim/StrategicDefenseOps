<?php

namespace App\Services;

use App\Models\User;

class AssignRoleService
{
    public function managerAssign(string $managerEmail, int $parentId): bool
    {
        $parent = User::find($parentId);

        $manager = User::where('email', $managerEmail)
            ->where('role_id', 2)
            ->whereNull('parent_id')
            ->first();

        if ($manager && $parentId && $parent->role_id == 1 && $manager->parent_id == null) {
            $manager->parent_id = $parentId;
            $manager->save();

            return true; // Success
        }

        return false; // Failure
    }

    public function operatorAssign($parentId, $operatorEmail, $managerEmail = null): bool
    {
        $parent = User::find($parentId);

        if (! $parent) {
            return false; // Failure
        }

        if ($parent->role_id == 1) {
            $manager = User::where('email', $managerEmail)
                ->where('role_id', 2)
                ->where('parent_id', $parentId)
                ->first();

            $operator = User::where('email', $operatorEmail)
                ->where('role_id', 3)
                ->whereNull('parent_id')
                ->first();

            if ($manager && $operator && $operator->parent_id == null) {
                $operator->parent_id = $manager->id;
                $operator->save();

                return true; // Success
            }

            return false; // Failure
        } elseif ($parent->role_id == 2) {
            $operator = User::where('email', $operatorEmail)
                ->where('role_id', 3)
                ->whereNull('parent_id')
                ->first();

            if ($operator && $operator->parent_id == null) {
                $operator->parent_id = $parentId;
                $operator->save();

                return true; // Success
            }

            return false; // Failure
        }

        return false; // Failure
    }

    public function assignViewer($parentId, $viewerEmail, $managerEmail = null): bool
    {
        $parent = User::find($parentId);

        if (! $parent) {
            return false; // Failure
        }

        if ($parent->role_id == 1) {
            $manager = User::where('email', $managerEmail)
                ->where('role_id', 2)
                ->where('parent_id', $parentId)
                ->first();

            $viewer = User::where('email', $viewerEmail)
                ->where('role_id', 4)
                ->whereNull('parent_id')
                ->first();

            if ($manager && $viewer && $viewer->parent_id == null) {
                $viewer->parent_id = $manager->id;
                $viewer->save();

                return true; // Success
            }
        } elseif ($parent->role_id == 2) {
            $viewer = User::where('email', $viewerEmail)
                ->where('role_id', 4)
                ->whereNull('parent_id')
                ->first();

            if ($viewer && $viewer->parent_id == null) {
                $viewer->parent_id = $parentId;
                $viewer->save();

                return true; // Success
            }
        }

        return false; // Failure
    }
}
