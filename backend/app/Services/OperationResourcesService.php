<?php

namespace App\Services;

use App\Models\Operation;
use App\Models\Resources;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class OperationResourcesService
{
    protected WeaponService $weaponService;

    protected VehicleService $vehicleService;

    protected PersonnelService $personnelService;

    protected EquipmentService $equipmentService;

    public function __construct(WeaponService $weaponService, VehicleService $vehicleService, EquipmentService $equipmentService, PersonnelService $personnelService)
    {
        $this->weaponService = $weaponService;
        $this->vehicleService = $vehicleService;
        $this->equipmentService = $equipmentService;
        $this->personnelService = $personnelService;
    }

    public function addOperationResources($datas, $operationId, $userId)
    {

        DB::beginTransaction();
        try {
            $user = User::find($userId);

            if ($user->role_id == 1) {
                $userId = $user->id;
            } elseif ($user->role_id == 2) {
                $userId = $user->parent_id;
            } else {
                $user = User::find($user->parent_id);

                $userId = $user->parent_id;
            }
            if (! $user || ! $userId) {
                throw new Exception('User not found');
            }
            $operation = DB::selectOne('select * from operations where created_by=? and id=?', [$userId, $operationId]);
            $operation = Operation::find($operation->id);
            if (! $operation) {
                throw new Exception('Operation not found');
            }
            for ($i = 0; $i < count($datas['serial_number']); $i++) {

                if ($datas['category'][$i] == 1) {
                    $resource = DB::select('
                select r.id,v.vehicle_count as count,v.id as vehicle_id from Resources r join Vehicle v on v.id=r.vehicle_id
                where v.vehicle_serial_number=?', [$datas['serial_number'][$i]]);

                    if ($resource[0] && $resource[0]->count >= $datas['count'][$i]) {

                        $data['vehicle_count'] = $resource[0]->count - $datas['count'][$i];
                        $updatedVehicle = $this->vehicleService->updateVehicle($data, $resource[0]->vehicle_id, $userId);
                        if (! $updatedVehicle) {
                            throw new Exception('Unable to update vehicle');
                        }

                        $operationResource = DB::insert('insert into operation_resources(operation_id,resource_id,resource_count)
                    values(?,?,?)',
                            [$operationId, $resource[0]->id, $datas['count'][$i]]

                        );
                        if (! $operationResource) {
                            throw new Exception('Unable to add operation resource');
                        }
                    } else {
                        throw new Exception('Inventory insufficient');
                    }

                } elseif ($datas['category'][$i] == 2) {
                    $resource = DB::select('
                select r.id,w.weapon_count as count,w.id as weapon_id from Resources r join Weapon w on w.id=r.weapon_id
                where w.weapon_serial_number=?', [$datas['serial_number'][$i]]);

                    if ($resource[0] && $resource[0]->count >= $datas['count'][$i]) {

                        $data['weapon_count'] = $resource[0]->count - $datas['count'][$i];
                        $updatedWeapon = $this->weaponService->updateWeapon($data, $resource[0]->weapon_id, $userId);
                        if (! $updatedWeapon) {
                            throw new Exception('Unable to update weapon');
                        }

                        $operationResource = DB::insert('insert into operation_resources(operation_id,resource_id,resource_count)
                values(?,?,?)',
                            [$operationId, $resource[0]->id, $datas['count'][$i]]

                        );
                        if (! $operationResource) {
                            throw new Exception('Unable to add operation resource');
                        }
                    } else {
                        throw new Exception('Inventory insufficient');
                    }

                } elseif ($datas['category'][$i] == 3) {
                    $resource = DB::select('
                select r.id,p.personnel_count as count,p.id as personnel_id from Resources r join Personnel p on p.id=r.personnel_id
                where p.personnel_serial_number=?', [$datas['serial_number'][$i]]);
                    if ($resource[0] && $resource[0]->count >= $datas['count'][$i]) {

                        $data['personnel_count'] = $resource[0]->count - $datas['count'][$i];
                        $updatedPersonnel = $this->personnelService->updatePersonnel($data, $resource[0]->personnel_id, $userId);
                        if (! $updatedPersonnel) {
                            throw new Exception('Unable to update personnel');
                        }

                        $operationResource = DB::insert('insert into operation_resources(operation_id,resource_id,resource_count)
                values(?,?,?)',
                            [$operationId, $resource[0]->id, $datas['count'][$i]]

                        );
                        if (! $operationResource) {
                            throw new Exception('Unable to add operation resource');
                        }
                    } else {
                        throw new Exception('Inventory insufficient');
                    }

                } elseif ($datas['category'][$i] == 4) {
                    $resource = DB::select('
                select r.id,e.equipment_count as count,e.id as equipment_id from Resources r join Equipment e on e.id=r.equipment_id
                where e.equipment_serial_number=?', [$datas['serial_number'][$i]]);
                    if ($resource[0] && $resource[0]->count >= $datas['count'][$i]) {

                        $data['equipment_count'] = $resource[0]->count - $datas['count'][$i];
                        $updatedPersonnel = $this->equipmentService->updateEquipment($data, $resource[0]->equipment_id, $userId);
                        if (! $updatedPersonnel) {
                            throw new Exception('Unable to update equipment');
                        }

                        $operationResource = DB::insert('insert into operation_resources(operation_id,resource_id,resource_count)
                values(?,?,?)',
                            [$operationId, $resource[0]->id, $datas['count'][$i]]

                        );
                        if (! $operationResource) {
                            throw new Exception('Unable to add operation resource');
                        }
                    } else {
                        throw new Exception('Inventory insufficient');
                    }

                } else {
                    throw new Exception('Invalid resource category');
                }

            }
            DB::commit();

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            error_log('Error adding operation resources: '.$e->getMessage());

            return false;
        }
    }

    public function getOperationResource($operationId, $userId)
    {
        DB::beginTransaction();
        try {
            $user = User::find($userId);

            if ($user->role_id == 1) {
                $userId = $user->id;
            } elseif ($user->role_id == 2) {
                $userId = $user->parent_id;
            } else {
                $user = User::find($user->parent_id);

                $userId = $user->parent_id;
            }
            if (! $user || ! $userId) {
                throw new \Exception('Could not find user');
            }
            $operation = DB::selectOne('select * from operations where created_by=? and id=?', [$userId, $operationId]);
            $operation = Operation::find($operation->id);
            if (! $operation) {
                throw new \Exception('Could not find operation');
            }
            $operationResources = DB::select('select * from operation_resources where operation_id=?', [$operation->id]);
            if (! $operationResources[0]) {
                throw new \Exception('Could not find operation resources');
            }
            $vehicle = [];
            $weapon = [];
            $personnel = [];
            $equipment = [];

            for ($i = 0; $i < count($operationResources); $i++) {
                $operationId = $operationResources[$i]->operation_id;

                $resourceId = $operationResources[$i]->resource_id;
                $resource = Resources::find($resourceId);
                if (! $resource) {
                    throw new \Exception('Could not find resource');
                }
                $resourceCategory = DB::selectOne('select * from resource_category where id=?', [$resource->resource_category]);
                $resourceCategory = $resourceCategory->resource_category;
                if ($resourceCategory == 'vehicle') {
                    $vehicleResource = DB::selectOne('select * from vehicle where id=?', [$resource->vehicle_id]);
                    $vehicleResource->vehicle_count = $operationResources[$i]->resource_count;

                    array_push($vehicle, $vehicleResource);

                } elseif ($resourceCategory == 'weapon') {
                    $weaponResource = DB::selectOne('select * from weapon where id=?', [$resource->weapon_id]);
                    $weaponResource->weapon_count = $operationResources[$i]->resource_count;

                    array_push($weapon, $weaponResource);
                } elseif ($resourceCategory == 'personnel') {
                    $personnelResource = DB::selectOne('select * from personnel where id=?', [$resource->personnel_id]);
                    $personnelResource->personnel_count = $operationResources[$i]->resource_count;

                    array_push($personnel, $personnelResource);

                } elseif ($resourceCategory == 'equipment') {
                    $equipmentResource = DB::selectOne('select * from equipment where id=?', [$resource->equipment_id]);
                    $equipmentResource->equipment_count = $operationResources[$i]->resource_count;
                    array_push($equipment, $equipmentResource);

                }
            }

            DB::commit();

            return ['operation' => $operation, 'vehicle' => $vehicle, 'weapon' => $weapon, 'personnel' => $personnel, 'equipment' => $equipment];
        } catch (\Exception $e) {
            DB::rollBack();
            error_log('Error getting operation resources: '.$e->getMessage());

            return [false, $e->getMessage()];
        }
    }

    public function updateOperationResource($operationId, $userId, $datas)
    {

        DB::beginTransaction();
        try {
            $user = User::find($userId);

            if ($user->role_id == 1) {
                $userId = $user->id;
            } elseif ($user->role_id == 2) {
                $userId = $user->parent_id;
            } else {
                $user = User::find($user->parent_id);

                $userId = $user->parent_id;
            }
            if (! $user || ! $userId) {
                throw new Exception('User not found');
            }
            $operation = DB::selectOne('select * from operations where created_by=? and id=?', [$userId, $operationId]);
            $operation = Operation::find($operation->id);
            if (! $operation) {
                throw new Exception('Operation not found');
            }

            for ($i = 0; $i < count($datas['serial_number']); $i++) {

                if ($datas['category'][$i] == 1) {
                    $resource = DB::select('
                select r.id,v.vehicle_count as count,v.id as vehicle_id from Resources r join Vehicle v on v.id=r.vehicle_id
                where v.vehicle_serial_number=?', [$datas['serial_number'][$i]]);
                    $serialNumberExist = DB::selectOne('select * from operation_resources where resource_id=? and operation_id=?', [$resource[0]->id, $operationId]);
                    if (! $serialNumberExist) {

                        throw new Exception('Serial number not found for vehicle');
                    }

                    $operationResourceCount = DB::selectOne('select resource_count from operation_resources where resource_id=? and operation_id=?', [$resource[0]->id, $operationId]);
                    $resource[0]->count = $operationResourceCount->resource_count + $resource[0]->count;

                    if ($resource[0] && $resource[0]->count >= $datas['count'][$i]) {

                        $data['vehicle_count'] = $resource[0]->count - $datas['count'][$i];
                        $updatedVehicle = $this->vehicleService->updateVehicle($data, $resource[0]->vehicle_id, $userId);
                        if (! $updatedVehicle) {
                            throw new Exception('Unable to update vehicle');
                        }

                        $operationResource = DB::update('update operation_resources set resource_count=? where resource_id=? and operation_id=?', [$datas['count'][$i], $resource[0]->id, $operationId]);

                        if (! $operationResource) {
                            throw new Exception('Unable to add operation resource');
                        }
                    } else {
                        throw new Exception('Inventory insufficient');
                    }

                } elseif ($datas['category'][$i] == 2) {
                    $resource = DB::select('
                select r.id,w.weapon_count as count,w.id as weapon_id from Resources r join Weapon w on w.id=r.weapon_id
                where w.weapon_serial_number=?', [$datas['serial_number'][$i]]);
                    $serialNumberExist = DB::selectOne('select * from operation_resources where resource_id=? and operation_id=?', [$resource[0]->id, $operationId]);
                    if (! $serialNumberExist) {

                        throw new Exception('Serial number not found for vehicle');
                    }
                    $operationResourceCount = DB::selectOne('select resource_count from operation_resources where resource_id=? and operation_id=?', [$resource[0]->id, $operationId]);
                    $resource[0]->count = $operationResourceCount->resource_count + $resource[0]->count;

                    if ($resource[0] && $resource[0]->count >= $datas['count'][$i]) {

                        $data['weapon_count'] = $resource[0]->count - $datas['count'][$i];
                        $updatedWeapon = $this->weaponService->updateWeapon($data, $resource[0]->weapon_id, $userId);
                        if (! $updatedWeapon) {
                            throw new Exception('Unable to update weapon');
                        }

                        $operationResource = DB::update('update operation_resources set resource_count=? where resource_id=? and operation_id=?', [$datas['count'][$i], $resource[0]->id, $operationId]);

                        if (! $operationResource) {
                            throw new Exception('Unable to add operation resource');
                        }
                    } else {
                        throw new Exception('Inventory insufficient');
                    }

                } elseif ($datas['category'][$i] == 3) {
                    $resource = DB::select('
                select r.id,p.personnel_count as count,p.id as personnel_id from Resources r join Personnel p on p.id=r.personnel_id
                where p.personnel_serial_number=?', [$datas['serial_number'][$i]]);
                    $serialNumberExist = DB::selectOne('select * from operation_resources where resource_id=? and operation_id=?', [$resource[0]->id, $operationId]);
                    if (! $serialNumberExist) {

                        throw new Exception('Serial number not found for vehicle');
                    }
                    $operationResourceCount = DB::selectOne('select resource_count from operation_resources where resource_id=? and operation_id=?', [$resource[0]->id, $operationId]);
                    $resource[0]->count = $operationResourceCount->resource_count + $resource[0]->count;
                    if ($resource[0] && $resource[0]->count >= $datas['count'][$i]) {

                        $data['personnel_count'] = $resource[0]->count - $datas['count'][$i];
                        $updatedPersonnel = $this->personnelService->updatePersonnel($data, $resource[0]->personnel_id, $userId);
                        if (! $updatedPersonnel) {
                            throw new Exception('Unable to update personnel');
                        }

                        $operationResource = DB::update('update operation_resources set resource_count=? where resource_id=? and operation_id=?', [$datas['count'][$i], $resource[0]->id, $operationId]);

                        if (! $operationResource) {
                            throw new Exception('Unable to add operation resource');
                        }
                    } else {
                        throw new Exception('Inventory insufficient');
                    }

                } elseif ($datas['category'][$i] == 4) {
                    $resource = DB::select('
                select r.id,e.equipment_count as count,e.id as equipment_id from Resources r join Equipment e on e.id=r.equipment_id
                where e.equipment_serial_number=?', [$datas['serial_number'][$i]]);
                    $serialNumberExist = DB::selectOne('select * from operation_resources where resource_id=? and operation_id=?', [$resource[0]->id, $operationId]);
                    if (! $serialNumberExist) {

                        throw new Exception('Serial number not found for vehicle');
                    }
                    $operationResourceCount = DB::selectOne('select resource_count from operation_resources where resource_id=? and operation_id=?', [$resource[0]->id, $operationId]);
                    $resource[0]->count = $operationResourceCount->resource_count + $resource[0]->count;
                    if ($resource[0] && $resource[0]->count >= $datas['count'][$i]) {

                        $data['equipment_count'] = $resource[0]->count - $datas['count'][$i];
                        $updatedPersonnel = $this->equipmentService->updateEquipment($data, $resource[0]->equipment_id, $userId);
                        if (! $updatedPersonnel) {
                            throw new Exception('Unable to update equipment');
                        }

                        $operationResource = DB::update('update operation_resources set resource_count=? where resource_id=? and operation_id=?', [$datas['count'][$i], $resource[0]->id, $operationId]);

                        if (! $operationResource) {
                            throw new Exception('Unable to add operation resource');
                        }
                    } else {
                        throw new Exception('Inventory insufficient');
                    }

                } else {
                    throw new Exception('Invalid resource category');
                }

            }
            DB::commit();

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            error_log('Error adding operation resources: '.$e->getMessage());

            return [false, $e->getMessage()];
        }

    }
}
