<?php

namespace App\Services;

use App\Models\OperationResources;
use DB;

class OperationResourcesService
{
    public function addOperationResources($datas,$operationId)
    {
        
        for ($i = 0; $i < count($datas["serial_number"]); $i++) {
          
            if($datas["category"][$i]==2){
                $resource=DB::select("
                select r.id from Resources r join Weapon w on w.id=r.weapon_id
                where w.weapon_serial_number=?",[$datas["serial_number"][$i]]);

               
            }
             $resourceId=$resource[0]->id;

            
             if($resourceId){
                $operationResources=DB::insert("
                insert into operation_resources (operation_id,resource_id,resource_count) values
                (?,?,?)
                ",[$operationId,$resourceId,$datas["count"][$i]]);
             }
             return $operationResources;
        }
    }
}