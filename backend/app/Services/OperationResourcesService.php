<?php

namespace App\Services;

use App\Models\OperationResources;
use DB;

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
            for ($i = 0; $i < count($datas["serial_number"]); $i++) {

                if ($datas["category"][$i] == 1) {
                    $resource = DB::select("
                select r.id,v.vehicle_count as count,v.id as vehicle_id from Resources r join Vehicle v on v.id=r.vehicle_id
                where v.vehicle_serial_number=?", [$datas["serial_number"][$i]]);


                    if ($resource[0] && $resource[0]->count >= $datas["count"][$i]) {

                        $data["vehicle_count"] = $resource[0]->count - $datas["count"][$i];
                        $updatedVehicle = $this->vehicleService->updateVehicle($data, $resource[0]->vehicle_id, $userId);
                        if (!$updatedVehicle) {
                            throw new Exception("Unable to update vehicle");
                        }

                        $operationResource = DB::insert("insert into operation_resources(operation_id,resource_id,resource_count)
                    values(?,?,?)",
                            [$operationId, $resource[0]->id, $datas["count"][$i]]

                        );
                        if (!$operationResource) {
                            throw new Exception("Unable to add operation resource");
                        }
                    } else {
                        throw new Exception("Inventory insufficient");
                    }


                } elseif ($datas["category"][$i] == 2) {
                    $resource = DB::select("
                select r.id,w.weapon_count as count,w.id as weapon_id from Resources r join Weapon w on w.id=r.weapon_id
                where w.weapon_serial_number=?", [$datas["serial_number"][$i]]);

                    if ($resource[0] && $resource[0]->count >= $datas["count"][$i]) {

                        $data["weapon_count"] = $resource[0]->count - $datas["count"][$i];
                        $updatedWeapon = $this->weaponService->updateWeapon($data, $resource[0]->weapon_id, $userId);
                        if (!$updatedWeapon) {
                            throw new Exception("Unable to update weapon");
                        }

                        $operationResource = DB::insert("insert into operation_resources(operation_id,resource_id,resource_count)
                values(?,?,?)",
                            [$operationId, $resource[0]->id, $datas["count"][$i]]

                        );
                        if (!$operationResource) {
                            throw new Exception("Unable to add operation resource");
                        }
                    } else {
                        throw new Exception("Inventory insufficient");
                    }


                } elseif ($datas["category"][$i] == 3) {
                    $resource = DB::select("
                select r.id,p.personnel_count as count,p.id as personnel_id from Resources r join Personnel p on p.id=r.personnel_id
                where p.personnel_serial_number=?", [$datas["serial_number"][$i]]);
                    if ($resource[0] && $resource[0]->count >= $datas["count"][$i]) {

                        $data["personnel_count"] = $resource[0]->count - $datas["count"][$i];
                        $updatedPersonnel = $this->personnelService->updatePersonnel($data, $resource[0]->personnel_id, $userId);
                        if (!$updatedPersonnel) {
                            throw new Exception("Unable to update personnel");
                        }

                        $operationResource = DB::insert("insert into operation_resources(operation_id,resource_id,resource_count)
                values(?,?,?)",
                            [$operationId, $resource[0]->id, $datas["count"][$i]]

                        );
                        if (!$operationResource) {
                            throw new Exception("Unable to add operation resource");
                        }
                    } else {
                        throw new Exception("Inventory insufficient");
                    }


                } elseif ($datas["category"][$i] == 4) {
                    $resource = DB::select("
                select r.id,e.equipment_count as count,e.id as equipment_id from Resources r join Equipment e on e.id=r.equipment_id
                where e.equipment_serial_number=?", [$datas["serial_number"][$i]]);
                    if ($resource[0] && $resource[0]->count >= $datas["count"][$i]) {

                        $data["equipment_count"] = $resource[0]->count - $datas["count"][$i];
                        $updatedPersonnel = $this->equipmentService->updateEquipment($data, $resource[0]->equipment_id, $userId);
                        if (!$updatedPersonnel) {
                            throw new Exception("Unable to update equipment");
                        }

                        $operationResource = DB::insert("insert into operation_resources(operation_id,resource_id,resource_count)
                values(?,?,?)",
                            [$operationId, $resource[0]->id, $datas["count"][$i]]

                        );
                        if (!$operationResource) {
                            throw new Exception("Unable to add operation resource");
                        }
                    } else {
                        throw new Exception("Inventory insufficient");
                    }

                } else {
                    throw new Exception("Invalid resource category");

                }




            }
            DB::commit();
            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            error_log("Error adding operation resources: " . $e->getMessage());
            return false;
        }
    }
}