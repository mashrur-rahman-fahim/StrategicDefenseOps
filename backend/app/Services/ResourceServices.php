<?php

namespace App\Services;

use App\Models\Resources;
use App\Models\Weapon;

class ResourceServices{
    
    public function addResource($data){
        $resource=Resources::create($data);
        if($resource){
            return $resource;
        }
        return false;
    }
    
}