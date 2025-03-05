<?php

namespace App\Services;

use App\Models\Equipment;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class EquipmentService
{
    /**
     * Add a new equipment.
     */
    public function addEquipment($data)
    {
        try {
            // Attempt to create the equipment
            $equipment = Equipment::create($data);
            if (! $equipment) {
                throw new Exception('Failed to add equipment');
            }

            return $equipment;
        } catch (Exception $e) {
            // Log the error and return false
            error_log('Error adding equipment: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Delete an equipment.
     */
    public function deleteEquipment($equipmentId, $userId)
    {
        try {
            // Fetch the equipment using raw SQL
            $equipment = DB::select('SELECT * FROM equipment WHERE authorized_by = ? AND id = ?', [$userId, $equipmentId]);
            if (empty($equipment)) {
                throw new Exception('Equipment not found or unauthorized');
            }

            // Delete the equipment using Eloquent
            $equipmentModel = Equipment::find($equipment[0]->id);
            if (! $equipmentModel) {
                throw new Exception('Failed to find equipment for deletion');
            }
            $equipmentModel->delete();

            return true;
        } catch (Exception $e) {
            // Log the error and return false
            error_log('Error deleting equipment: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Update an equipment.
     */
    public function updateEquipment($data, $equipmentId, $userId)
    {
        try {
            $user = User::find($userId);
            if (! $user) {
                throw new Exception('User not found');
            }

            if ($user->role_id == 1) {
                // Fetch the equipment authorized by the user
                $equipment = DB::select('SELECT * FROM equipment WHERE authorized_by = ? AND id = ?', [$userId, $equipmentId]);
                if (empty($equipment)) {
                    throw new Exception('Equipment not found or unauthorized');
                }

                // Update the equipment using Eloquent
                $equipmentModel = Equipment::find($equipment[0]->id);
                if (! $equipmentModel) {
                    throw new Exception('Failed to find equipment for update');
                }
                $equipmentModel->update($data);

                return $equipmentModel;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$user->id]);
                if (! $adminId || ! $adminId->parent_id) {
                    throw new Exception('Admin ID not found');
                }

                // Fetch the equipment authorized by the admin
                $equipment = DB::select('SELECT * FROM equipment WHERE authorized_by = ? AND id = ?', [$adminId->parent_id, $equipmentId]);
                if (empty($equipment)) {
                    throw new Exception('Equipment not found or unauthorized');
                }

                // Update the equipment using Eloquent
                $equipmentModel = Equipment::find($equipment[0]->id);
                if (! $equipmentModel) {
                    throw new Exception('Failed to find equipment for update');
                }
                $equipmentModel->update($data);

                return $equipmentModel;
            }

            throw new Exception('Unauthorized role');
        } catch (Exception $e) {
            // Log the error and return false
            error_log('Error updating equipment: '.$e->getMessage());

            return false;
        }
    }

    public function getEquipmentById($equipmentId)
    {
        return Equipment::find($equipmentId);
    }

    /**
     * Get all equipment.
     */
    public function getAllEquipment($userId)
    {
        try {
            $user = User::find($userId);
            if (! $user) {
                throw new Exception('User not found');
            }

            if ($user->role_id == 1) {
                // Fetch equipment authorized by the user
                $equipment = DB::select('SELECT * FROM equipment WHERE authorized_by = ?', [$userId]);
                if (empty($equipment)) {
                    throw new Exception('No equipment found');
                }

                return $equipment;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$userId]);
                if (! $adminId || ! $adminId->parent_id) {
                    throw new Exception('Admin ID not found');
                }

                // Fetch equipment authorized by the admin
                $equipment = DB::select('SELECT * FROM equipment WHERE authorized_by = ?', [$adminId->parent_id]);
                if (empty($equipment)) {
                    throw new Exception('No equipment found');
                }

                return $equipment;
            }

            throw new Exception('Unauthorized role');
        } catch (Exception $e) {
            // Log the error and return false
            error_log('Error fetching equipment: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get an equipment by name.
     */
    public function getEquipmentByName($equipmentName, $userId)
    {
        try {
            $user = User::find($userId);
            if (! $user) {
                throw new Exception('User not found');
            }

            if ($user->role_id == 1) {
                // Fetch equipment authorized by the user
                $equipment = DB::select('SELECT * FROM equipment WHERE authorized_by = ? AND equipment_name LIKE ?', [$userId, '%'.$equipmentName.'%']);
                if (empty($equipment)) {
                    throw new Exception('No equipment found');
                }

                return $equipment;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$userId]);
                if (! $adminId || ! $adminId->parent_id) {
                    throw new Exception('Admin ID not found');
                }

                // Fetch equipment authorized by the admin
                $equipment = DB::select('SELECT * FROM equipment WHERE authorized_by = ? AND equipment_name LIKE ?', [$adminId->parent_id, '%'.$equipmentName.'%']);
                if (empty($equipment)) {
                    throw new Exception('No equipment found');
                }

                return $equipment;
            }

            throw new Exception('Unauthorized role');
        } catch (Exception $e) {
            // Log the error and return false
            error_log('Error fetching equipment by name: '.$e->getMessage());

            return false;
        }
    }
}
