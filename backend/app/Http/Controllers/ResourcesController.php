<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ResourceServices;

class ResourcesController extends Controller
{
    //
    protected ResourceServices $resourceServices;

    public function __construct(ResourceServices $resourceServices)
    {
        $this->resourceServices = $resourceServices;
    }

    public function getAllResources()
    {
        $user = User::find(auth()->id());
      
        $resources = $this->resourceServices->getAllResources(auth()->id());
        
        return response()->json($resources);

    }
}
