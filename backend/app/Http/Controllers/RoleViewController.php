<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\RoleViewService;
use Illuminate\Http\Request;

class RoleViewController extends Controller
{
    protected RoleViewService $roleViewService;
     public function __construct(RoleViewService $roleViewService){
        $this->roleViewService = $roleViewService;
    }
    public function roleView(){
        $user=User::find(auth()->id());
        if($user->role_id==1){
            $managers=$this->roleViewService->downView($user,2);
           $underManager=[];
            foreach($managers as $manager){
               $underManager[$manager]=[ 'operators'=>$this->roleViewService->downView($manager,3),
                'viewers'=>$this->roleViewService->downView($manager,4)];
              
            }
            return response()->json($underManager,200);
        }
        elseif($user->role_id==2){
            $admin=$this->roleViewService->upView($user);
            $operators=$this->roleViewService->downView($user,3);
            $viewers=$this->roleViewService->downView($user,4);
            return response()->json(['admin'=>$admin,'operators'=>$operators,'viewers'=>$viewers],200);
        }
        elseif($user->role_id==3 || $user->role_id==4){
            $manager=$this->roleViewService->upView($user);
            $admin=$this->roleViewService->upView($manager);
            return response()->json(['admin'=>$admin,'manager'=>$manager],200);

        }
        return response()->json(["unauthorized"],401);
        
    }
}
