<?php

namespace App\Services;

use App\Models\Resources;
use App\Models\Weapon;

class ResourceServices{
    protected WeaponService $weaponService;
    protected VehicleService    $vehicleService;
    protected PersonnelService $personnelService;
    protected EquipmentService $equipmentService;
    public function __construct(WeaponService $weaponService, VehicleService $vehicleService, EquipmentService $equipmentService, PersonnelService $personnelService){
        $this->weaponService = $weaponService;
        $this->vehicleService = $vehicleService;
        $this->equipmentService = $equipmentService;
        $this->personnelService = $personnelService;
    }
    
    public function addResource($data){
        $resource=Resources::create($data);
        if($resource){
            return $resource;
        }
        return false;
    }
    public function getAllResources($userId){
        $weapon=$this->weaponService->getAllWeapons($userId);
        $vehicle=$this->vehicleService->getAllVehicles($userId);
        $equipment=$this->equipmentService->getAllEquipment($userId);
        $personnel=$this->personnelService->getAllPersonnel($userId);
        $resources=array_merge($weapon,$vehicle,$equipment,$personnel);
        return $resources;

    }
    
}