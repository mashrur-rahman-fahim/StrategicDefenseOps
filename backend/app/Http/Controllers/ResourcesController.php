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
        $user=User::find(auth()->id());
        if(!$user || $user->role_id>2){
            return response()->json(['message'=>'Unauthorized'],401);
        }
        $resources=$this->resourceServices->getAllResources(auth()->id());
        return response()->json($resources);

    }
    
}
