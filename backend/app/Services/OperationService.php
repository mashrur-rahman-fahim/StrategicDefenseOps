<?php

namespace App\Services;
use App\Models\Operation;
use App\Models\User;

class OperationService{
    public function createOperation($data){
        return Operation::create($data);
        
    }
}