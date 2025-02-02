<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AssignRoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Exceptions\InvalidRoleException;
use App\Exceptions\UserNotAssignedException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AssignRoleController extends Controller
{
    protected AssignRoleService $assignRoleService;

    public function __construct(AssignRoleService $assignRoleService)
    {
        $this->assignRoleService = $assignRoleService;
    }

    public function managerAssign(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'managerEmail' => 'required|email|exists:users,email',
            ]);

            $parentId = auth()->id();
            $result = $this->assignRoleService->managerAssign($request->managerEmail, $parentId);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (ValidationException $e) {
            throw $e; // Let the handler process validation errors
        } catch (AuthorizationException $e) {
            throw new AuthorizationException('Unauthorized to assign manager role');
        } catch (ModelNotFoundException $e) {
            throw new ModelNotFoundException('User not found');
        } catch (\Exception $e) {
            throw new \Exception('Failed to assign manager role: ' . $e->getMessage());
        }
    }

    public function operatorAssign(Request $request): JsonResponse
    {
        try {
            $parentId = auth()->id();
            $data = $request->validate([
                'operatorEmail' => 'required|email|exists:users,email',
                'managerEmail' => 'nullable|email|exists:users,email'
            ]);

            $result = $this->assignRoleService->operatorAssign(
                $parentId,
                $data['operatorEmail'],
                $data['managerEmail'] ?? null
            );

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (ValidationException $e) {
            throw $e;
        } catch (InvalidRoleException $e) {
            throw new InvalidRoleException('Invalid role assignment for operator');
        } catch (UserNotAssignedException $e) {
            throw new UserNotAssignedException('Operator not properly assigned');
        } catch (\Exception $e) {
            throw new \Exception('Failed to assign operator role: ' . $e->getMessage());
        }
    }

    public function viewerAssign(Request $request): JsonResponse
    {
        try {
            $parentId = auth()->id();
            $data = $request->validate([
                'viewerEmail' => 'required|email|exists:users,email',
                'managerEmail' => 'nullable|email|exists:users,email'
            ]);

            $result = $this->assignRoleService->assignViewer(
                $parentId,
                $data['viewerEmail'],
                $data['managerEmail'] ?? null
            );

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (ValidationException $e) {
            throw $e;
        } catch (InvalidRoleException $e) {
            throw new InvalidRoleException('Invalid role assignment for viewer');
        } catch (UserNotAssignedException $e) {
            throw new UserNotAssignedException('Viewer not properly assigned');
        } catch (\Exception $e) {
            throw new \Exception('Failed to assign viewer role: ' . $e->getMessage());
        }
    }

    public function temp(Request $request): JsonResponse
    {
        try {
            $user = User::where('role_id', 3)->firstOrFail();
            $user->parent_id = 11;
            $user->save();

            return response()->json([
                'success' => true,
                'data' => $user
            ]);

        } catch (ModelNotFoundException $e) {
            throw new ModelNotFoundException('No users with operator role found');
        } catch (\Exception $e) {
            throw new \Exception('Temporary operation failed: ' . $e->getMessage());
        }
    }
}