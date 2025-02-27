<?php

namespace App\Services;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;
use Exception;
use Spatie\Activitylog\Models\Activity;


class VehicleService
{
    /**
     * Add a new vehicle.
     */
    public function addVehicle($data)
    {
        try {
            // Attempt to create the vehicle
            $vehicle = Vehicle::create($data);
            if (!$vehicle) {
                throw new Exception("Failed to add vehicle");
            }
            return $vehicle;
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error adding vehicle: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete a vehicle.
     */
    public function deleteVehicle($vehicleId, $userId)
    {
        try {
            // Fetch the vehicle using raw SQL
            $vehicle = DB::select('SELECT * FROM vehicle WHERE authorized_by = ? AND id = ?', [$userId, $vehicleId]);
            if (empty($vehicle)) {
                throw new Exception("Vehicle not found or unauthorized");
            }

            // Delete the vehicle using Eloquent
            $vehicleModel = Vehicle::find($vehicle[0]->id);
            if (!$vehicleModel) {
                throw new Exception("Failed to find vehicle for deletion");
            }
            $vehicleModel->delete();
            return true;
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error deleting vehicle: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update a vehicle.
     */
    public function updateVehicle($data, $vehicleId, $userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch the vehicle authorized by the user
                $vehicle = DB::select('SELECT * FROM vehicle WHERE authorized_by = ? AND id = ?', [$userId, $vehicleId]);
                if (empty($vehicle)) {
                    throw new Exception("Vehicle not found or unauthorized");
                }

                // Update the vehicle using Eloquent
                $vehicleModel = Vehicle::find($vehicle[0]->id);
                if (!$vehicleModel) {
                    throw new Exception("Failed to find vehicle for update");
                }
                $vehicleModel->update($data);
                return $vehicleModel;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$user->id]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch the vehicle authorized by the admin
                $vehicle = DB::select('SELECT * FROM vehicle WHERE authorized_by = ? AND id = ?', [$adminId->parent_id, $vehicleId]);
                if (empty($vehicle)) {
                    throw new Exception("Vehicle not found or unauthorized");
                }

                // Update the vehicle using Eloquent
                $vehicleModel = Vehicle::find($vehicle[0]->id);
                if (!$vehicleModel) {
                    throw new Exception("Failed to find vehicle for update");
                }
                $vehicleModel->update($data);
                return $vehicleModel;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error updating vehicle: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all vehicles.
     */
    public function getAllVehicles($userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch vehicles authorized by the user
                $vehicles = DB::select('SELECT * FROM vehicle WHERE authorized_by = ?', [$userId]);
                if (empty($vehicles)) {
                    throw new Exception("No vehicles found");
                }
                return $vehicles;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$userId]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch vehicles authorized by the admin
                $vehicles = DB::select('SELECT * FROM vehicle WHERE authorized_by = ?', [$adminId->parent_id]);
                if (empty($vehicles)) {
                    throw new Exception("No vehicles found");
                }
                return $vehicles;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error fetching vehicles: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get a vehicle by name.
     */
    public function getVehicleByName($vehicleName, $userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                throw new Exception("User not found");
            }

            if ($user->role_id == 1) {
                // Fetch vehicles authorized by the user
                $vehicles = DB::select('SELECT * FROM vehicle WHERE authorized_by = ? AND vehicle_name LIKE ?', [$userId, '%' . $vehicleName . '%']);
                if (empty($vehicles)) {
                    throw new Exception("No vehicles found");
                }
                return $vehicles;
            } elseif ($user->role_id == 2) {
                // Fetch the admin ID (parent_id) of the user
                $adminId = DB::selectOne('SELECT parent_id FROM users WHERE id = ?', [$userId]);
                if (!$adminId || !$adminId->parent_id) {
                    throw new Exception("Admin ID not found");
                }

                // Fetch vehicles authorized by the admin
                $vehicles = DB::select('SELECT * FROM vehicle WHERE authorized_by = ? AND vehicle_name LIKE ?', [$adminId->parent_id, '%' . $vehicleName . '%']);
                if (empty($vehicles)) {
                    throw new Exception("No vehicles found");
                }
                return $vehicles;
            }

            throw new Exception("Unauthorized role");
        } catch (Exception $e) {
            // Log the error and return false
            error_log("Error fetching vehicle by name: " . $e->getMessage());
            return false;
        }
    }
}