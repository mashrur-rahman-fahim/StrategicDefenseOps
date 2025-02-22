<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ResourceServices;
use Illuminate\Http\Request;

class ResourcesController extends Controller
{
    //
    protected ResourceServices $resourceServices;
    public function __construct(ResourceServices $resourceServices)
    {
        $this->resourceServices = $resourceServices;
    }
    public function getAllResources(){
        $user=User::find()

    }
    
}
