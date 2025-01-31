<?php

namespace App\Services;

use App\Models\User;


class AssignRoleService
{


    public function managerAssign(string $managerEmail, int $parentId)
    {


        $parent = User::find($parentId);

        $manager = User::where('email', $managerEmail)->where('role_id', 2)->where('parent_id', null)->first();
        if ($manager && $parentId && $parent->role_id == 1) {
            $manager->parent_id = $parentId;
            $manager->save();
            return [
                $manager,
                $managerEmail,
                $parentId,
                

            ];
        }
        return [
            'message' => 'Not assigned to role',
           
        ];


    }
    public function operatorAssign($parentId,  $operatorEmail,$managerEmail = null)
    {
        $parent = User::find($parentId);

        if (!$parent) {
            return ['message' => 'Parent not found'];
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

            if ($manager && $operator) {
                $operator->parent_id = $manager->id;
                $operator->save();
                return [
                    'operator' => $operator,
                    'manager' => $manager,
                    'parent' => $parent
                ];
            }
        } elseif ($parent->role_id == 2) {
            $operator = User::where('email', $operatorEmail)
                ->where('role_id', 3)
                ->whereNull('parent_id')
                ->first();

            if ($operator) {
                $operator->parent_id = $parentId;
                $operator->save();
                return [
                    'operator' => $operator,
                    'parent' => $parent
                ];
            }
        }

        return ['message' => 'Not assigned to role', 'parent' => $parent];
    }

    public function assignViewer($parentId,  $viewerEmail,$managerEmail = null)
    {
        $parent = User::find($parentId);
        if (!$parent) {
            return ['message' => 'Parent not found'];
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

            if ($manager && $viewer) {
                $viewer->parent_id = $manager->id;
                $viewer->save();
                return ['viewer' => $viewer, 'manager' => $manager, 'parent' => $parent];
            }
        } elseif ($parent->role_id == 2) {
            $viewer = User::where('email', $viewerEmail)
                ->where('role_id', 4)
                ->whereNull('parent_id')
                ->first();

            if ($viewer) {
                $viewer->parent_id = $parentId;
                $viewer->save();
                return ['viewer' => $viewer, 'parent' => $parent];
            }
        }

        return ['message' => 'Not assigned to role', 'parent' => $parent];
    }
}