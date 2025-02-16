<?php
namespace App\Services;

use App\Models\Weapon;

class WeaponService{
    public function addWeapon($data){
        $weapon=Weapon::create($data);
        if($weapon){
            return $weapon;
        }
        return false;
    }
    public function deleteWeapon($weaponId){
        $weapon=Weapon::find($weaponId);
        if($weapon){
            $weapon->delete();
            return true;
        }
        return false;
    }
}