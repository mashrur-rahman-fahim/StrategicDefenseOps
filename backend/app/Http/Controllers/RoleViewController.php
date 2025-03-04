<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\RoleViewService;
use Illuminate\Http\Request;

class RoleViewController extends Controller
{
    protected RoleViewService $roleViewService;

    public function __construct(RoleViewService $roleViewService)
    {
        $this->roleViewService = $roleViewService;
    }

    public function roleView()
    {
        $user = User::find(auth()->id());

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        switch ($user->role_id) {
            case 1:
                return $this->getAdminView($user);
            case 2:
                return $this->getManagerView($user);
            case 3:
            case 4:
                return $this->getOperatorOrViewerView($user);
            default:
                return response()->json(['message' => 'Unauthorized access'], 401);
        }
    }

    private function getAdminView(User $user)
    {
        $managers = $this->roleViewService->downView($user, 2);

        if (empty($managers[1])) {
            return response()->json(['message' => 'No managers found'], 200);
        }

        $underManagers = [];
        foreach ($managers[1] as $manager) {
            $underManagers[] = [
                'manager' => $manager,
                'operators' => $this->roleViewService->downView($manager, 3),
                'viewers' => $this->roleViewService->downView($manager, 4)
            ];
        }

        return response()->json(['managers' => $underManagers], 200);
    }

    private function getManagerView(User $user)
    {
        return response()->json([
            'admin' => $this->roleViewService->upView($user),
            'operators' => $this->roleViewService->downView($user, 3),
            'viewers' => $this->roleViewService->downView($user, 4)
        ], 200);
    }

    private function getOperatorOrViewerView(User $user)
    {
        $manager = $this->roleViewService->upView($user);
        $admin = $this->roleViewService->upView($manager);
        
        return response()->json([
            'admin' => $admin,
            'manager' => $manager
        ], 200);
    }
}
