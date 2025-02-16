<?php

namespace App\Services;

use App\Models\User;
use App\Models\Weapon;
use DB;
use Exception;

class WeaponService
{
    /**
     * Add a new weapon.
     */
    public function addWeapon($data)
    {
        try {
            // Attempt to create the weapon
            $weapon = Weapon::create($data);
            if (!$weapon) {
                throw new Exception("Failed to add weapon");
            }
            return $weapon;
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error adding weapon: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete a weapon.
     */
    public function deleteWeapon($weaponId, $userId)
    {
        try {
            // Fetch the weapon using raw SQL
            $weapon = DB::select('SELECT * FROM weapon WHERE authorized_by = ? AND id = ?', [$userId, $weaponId]);
            if (empty($weapon)) {
                throw new Exception("Weapon not found or unauthorized");
            }

            // Delete the weapon using Eloquent
            $weaponModel = Weapon::find($weapon[0]->id);
            if (!$weaponModel) {
                throw new Exception("Failed to find weapon for deletion");
            }

            $weaponModel->delete();
            return true;
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error deleting weapon: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update a weapon.
     */
    public function updateWeapon($data, $weaponId, $userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch the weapon authorized by the user
                $weapon = DB::select('SELECT * FROM weapon WHERE authorized_by = ? AND id = ?', [$userId, $weaponId]);
                if (empty($weapon)) {
                    throw new Exception("Weapon not found or unauthorized");
                }

                // Update the weapon using Eloquent
                $weaponModel = Weapon::find($weapon[0]->id);
                if (!$weaponModel) {
                    throw new Exception("Failed to find weapon for update");
                }

                $weaponModel->update($data);
                return $weaponModel;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$user->id]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch the weapon authorized by the admin
                $weapon = DB::select('SELECT * FROM weapon WHERE authorized_by = ? AND id = ?', [$adminId->parent_id, $weaponId]);
                if (empty($weapon)) {
                    throw new Exception("Weapon not found or unauthorized");
                }

                // Update the weapon using Eloquent
                $weaponModel = Weapon::find($weapon[0]->id);
                if (!$weaponModel) {
                    throw new Exception("Failed to find weapon for update");
                }

                $weaponModel->update($data);
                return $weaponModel;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error updating weapon: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all weapons.
     */
    public function getAllWeapons($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch weapons authorized by the user
                $weapons = DB::select('SELECT * FROM weapon WHERE authorized_by = ?', [$userId]);
                if (empty($weapons)) {
                    throw new Exception("No weapons found");
                }
                return $weapons;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$userId]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch weapons authorized by the admin
                $weapons = DB::select('SELECT * FROM weapon WHERE authorized_by = ?', [$adminId->parent_id]);
                if (empty($weapons)) {
                    throw new Exception("No weapons found");
                }
                return $weapons;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error fetching weapons: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get a weapon by name.
     */
    public function getWeaponByName($weaponName, $userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch weapons authorized by the user
                $weapons = DB::select('SELECT * FROM weapon WHERE authorized_by = ? AND weapon_name LIKE ?', [$userId, '%' . $weaponName . '%']);
                if (empty($weapons)) {
                    throw new Exception("No weapons found");
                }
                return $weapons;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$userId]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch weapons authorized by the admin
                $weapons = DB::select('SELECT * FROM weapon WHERE authorized_by = ? AND weapon_name LIKE ?', [$adminId->parent_id, '%' . $weaponName . '%']);
                if (empty($weapons)) {
                    throw new Exception("No weapons found");
                }
                return $weapons;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error fetching weapon by name: " . $e->getMessage());
            return false;
        }
    }
}