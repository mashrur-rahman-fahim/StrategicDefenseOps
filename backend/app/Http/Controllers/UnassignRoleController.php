<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UnassignRoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\UserNotAssignedException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class UnassignRoleController extends Controller
{
    private UnassignRoleService $unassignRoleService;

    public function __construct(UnassignRoleService $unassignRoleService)
    {
        $this->unassignRoleService = $unassignRoleService;
    }

    public function managerUnassign(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'managerEmail' => 'required|email|exists:users,email',
            ]);

            $parent = $this->getAuthenticatedParent();
            $this->validateParentRole($parent, 1);

            $manager = $this->unassignRoleService->unassignRole(
                $request->managerEmail,
                2, // Manager role ID
                $parent->id
            );

            if (!$manager) {
                throw new UserNotAssignedException('Manager not found or not assigned');
            }

            return response()->json([
                'success' => true,
                'data' => $manager
            ]);

        } catch (ValidationException $e) {
            throw $e;
        } catch (AuthorizationException $e) {
            throw new AuthorizationException('Unauthorized to unassign manager');
        } catch (UserNotAssignedException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Manager unassignment failed: ' . $e->getMessage());
            throw new \Exception('Failed to unassign manager role');
        }
    }

    public function operatorUnassign(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'operatorEmail' => 'required|email|exists:users,email',
            ]);

            $parent = $this->getAuthenticatedParent();
            $manager = null;

            if ($parent->role_id == 1) {
                $request->validate(['managerEmail' => 'required|email|exists:users,email']);
                $manager = $this->findManager($request->managerEmail, $parent->id);
            }

            $operator = $this->unassignRoleService->unassignRole(
                $request->operatorEmail,
                3, // Operator role ID
                $manager ? $manager->id : $parent->id
            );

            if (!$operator) {
                throw new UserNotAssignedException('Operator not found or not assigned');
            }

            return response()->json([
                'success' => true,
                'data' => $operator
            ]);

        } catch (ValidationException $e) {
            throw $e;
        } catch (AuthorizationException $e) {
            throw new AuthorizationException('Unauthorized to unassign operator');
        } catch (UserNotAssignedException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Operator unassignment failed: ' . $e->getMessage());
            throw new \Exception('Failed to unassign operator role');
        }
    }

    public function viewerUnassign(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'viewerEmail' => 'required|email|exists:users,email',
            ]);

            $parent = $this->getAuthenticatedParent();
            $manager = null;

            if ($parent->role_id == 1) {
                $request->validate(['managerEmail' => 'required|email|exists:users,email']);
                $manager = $this->findManager($request->managerEmail, $parent->id);
            }

            $viewer = $this->unassignRoleService->unassignRole(
                $request->viewerEmail,
                4, // Viewer role ID
                $manager ? $manager->id : $parent->id
            );

            if (!$viewer) {
                throw new UserNotAssignedException('Viewer not found or not assigned');
            }

            return response()->json([
                'success' => true,
                'data' => $viewer
            ]);

        } catch (ValidationException $e) {
            throw $e;
        } catch (AuthorizationException $e) {
            throw new AuthorizationException('Unauthorized to unassign viewer');
        } catch (UserNotAssignedException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Viewer unassignment failed: ' . $e->getMessage());
            throw new \Exception('Failed to unassign viewer role');
        }
    }

    protected function getAuthenticatedParent(): User
    {
        $parent = User::find(auth()->id());
        
        if (!$parent) {
            throw new AuthorizationException('Unauthorized access');
        }

        return $parent;
    }

    protected function validateParentRole(User $parent, int $requiredRole): void
    {
        if ($parent->role_id !== $requiredRole) {
            throw new AuthorizationException('Insufficient privileges for this operation');
        }
    }

    protected function findManager(string $email, int $parentId): User
    {
        $manager = User::where('email', $email)
            ->where('role_id', 2)
            ->where('parent_id', $parentId)
            ->first();

        if (!$manager) {
            throw new UserNotAssignedException('Specified manager not found or not assigned');
        }

        return $manager;
    }
}