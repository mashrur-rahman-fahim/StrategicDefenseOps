<?php

namespace App\Services;

use App\Models\User;
use App\Models\Personnel;
use Illuminate\Support\Facades\DB;
use Exception;

class PersonnelService
{
    /**
     * Add a new personnel.
     */
    public function addPersonnel($data)
    {
        try {
            // Attempt to create the personnel
            $personnel = Personnel::create($data);
            if (!$personnel) {
                throw new Exception("Failed to add personnel");
            }
            return $personnel;
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error adding personnel: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete a personnel.
     */
    public function deletePersonnel($personnelId, $userId)
    {
        try {
            // Fetch the personnel using raw SQL
            $personnel = DB::select('SELECT * FROM personnel WHERE authorized_by = ? AND id = ?', [$userId, $personnelId]);
            if (empty($personnel)) {
                throw new Exception("Personnel not found or unauthorized");
            }

            // Delete the personnel using Eloquent
            $personnelModel = Personnel::find($personnel[0]->id);
            if (!$personnelModel) {
                throw new Exception("Failed to find personnel for deletion");
            }
            $personnelModel->delete();
            return true;
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error deleting personnel: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update a personnel.
     */
    public function updatePersonnel($data, $personnelId, $userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch the personnel authorized by the user
                $personnel = DB::select('SELECT * FROM personnel WHERE authorized_by = ? AND id = ?', [$userId, $personnelId]);
                if (empty($personnel)) {
                    throw new Exception("Personnel not found or unauthorized");
                }

                // Update the personnel using Eloquent
                $personnelModel = Personnel::find($personnel[0]->id);
                if (!$personnelModel) {
                    throw new Exception("Failed to find personnel for update");
                }
                $personnelModel->update($data);
                return $personnelModel;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$user->id]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch the personnel authorized by the admin
                $personnel = DB::select('SELECT * FROM personnel WHERE authorized_by = ? AND id = ?', [$adminId->parent_id, $personnelId]);
                if (empty($personnel)) {
                    throw new Exception("Personnel not found or unauthorized");
                }

                // Update the personnel using Eloquent
                $personnelModel = Personnel::find($personnel[0]->id);
                if (!$personnelModel) {
                    throw new Exception("Failed to find personnel for update");
                }
                $personnelModel->update($data);
                return $personnelModel;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error updating personnel: " . $e->getMessage());
            return false;
        }
    }

    public function findPersonnelById($id)
    {
        // Find the personnel by ID, or return null if not found
        return Personnel::find($id);
    }

    /**
     * Get all personnel.
     */
    public function getAllPersonnel($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch personnel authorized by the user
                $personnel = DB::select('SELECT * FROM personnel WHERE authorized_by = ?', [$userId]);
                if (empty($personnel)) {
                    throw new Exception("No personnel found");
                }
                return $personnel;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$userId]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch personnel authorized by the admin
                $personnel = DB::select('SELECT * FROM personnel WHERE authorized_by = ?', [$adminId->parent_id]);
                if (empty($personnel)) {
                    throw new Exception("No personnel found");
                }
                return $personnel;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error fetching personnel: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get a personnel by name.
     */
    public function getPersonnelByName($personnelName, $userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch personnel authorized by the user
                $personnel = DB::select('SELECT * FROM personnel WHERE authorized_by = ? AND personnel_name LIKE ?', [$userId, '%' . $personnelName . '%']);
                if (empty($personnel)) {
                    throw new Exception("No personnel found");
                }
                return $personnel;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$userId]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch personnel authorized by the admin
                $personnel = DB::select('SELECT * FROM personnel WHERE authorized_by = ? AND personnel_name LIKE ?', [$adminId->parent_id, '%' . $personnelName . '%']);
                if (empty($personnel)) {
                    throw new Exception("No personnel found");
                }
                return $personnel;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error fetching personnel by name: " . $e->getMessage());
            return false;
        }
    }
}