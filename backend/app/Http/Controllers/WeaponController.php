<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ResourceServices;
use App\Services\WeaponService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WeaponController extends Controller
{
    //
    protected WeaponService $weaponService;
    protected ResourceServices $resourceServices;
    public function __construct(WeaponService $weaponService, ResourceServices $resourceServices)
    {
        $this->weaponService = $weaponService;
        $this->resourceServices = $resourceServices;
    }


   

    public function addWeapon(Request $request)
    {
        $data = $request->validate([
            'weapon_name' => 'required|string|max:255',
            'weapon_description' => 'nullable|string',
            'weapon_count' => 'required|integer|min:1',
            'weapon_category' => 'nullable|string|max:100',
            'weapon_type' => 'nullable|string|max:100',
            'weapon_model' => 'nullable|string|max:100',
            'weapon_manufacturer' => 'nullable|string|max:150',
            'weapon_serial_number' => 'required|string|unique:weapon,weapon_serial_number|max:100',
            'weapon_weight' => 'nullable|numeric|min:0',
            'weapon_range' => 'nullable|integer|min:0',
        ]);

        $resourceData = $request->validate([
            'resource_category' => 'required|integer|min:1|max:4'
        ]);

        $user = User::find(auth()->id());

        if ($user && ($user->role_id == 1)) {
            $data['authorized_by'] = auth()->id();
            $resourceData['resources_name'] = $data['weapon_name'];

       
            DB::beginTransaction();
            try {
                // Insert weapon
                $weapon = $this->weaponService->addWeaponService($data);
                if (!$weapon) {
                    throw new Exception("Failed to add weapon");
                }

           
                $resourceData['weapon_id'] = $weapon->id;
                $resource = $this->resourceServices->addResourceService($resourceData);
                if (!$resource) {
                    throw new Exception("Failed to add resource");
                }

               
                DB::commit();
                return response()->json([
                    'message' => 'Weapon added successfully',
                    'weapon' => $weapon,
                    'resource' => $resource,
                ]);

            } catch (Exception $e) {
               
                DB::rollback();
                return response()->json([
                    'error' => $e->getMessage(),
                ], 500);
            }
        }

        return response()->json([
            'error' => 'Unauthorized'
        ], 403);
    }


}
