<?php

namespace App\Services;

use App\Models\Resources;
use App\Models\User;
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
        $user=User::find($userId);
        if($user->role_id==2 && $user->parent_id!=null){
            $userId=$user->parent_id;
        }
        $weapon=$this->weaponService->getAllWeapons($userId);
        $vehicle=$this->vehicleService->getAllVehicles($userId);
        $equipment=$this->equipmentService->getAllEquipment($userId);
        $personnel=$this->personnelService->getAllPersonnel($userId);
       $resources=[];
       if($weapon){
            $resources=array_merge($resources,$weapon);
       }
       if($vehicle){
            $resources=array_merge($resources,$vehicle);
       }
       if($equipment){
            $resources=array_merge($resources,$equipment);
       }
       if($personnel){
            $resources=array_merge($resources,$personnel);
       }
        return [count($resources),$resources];

    }
    
}