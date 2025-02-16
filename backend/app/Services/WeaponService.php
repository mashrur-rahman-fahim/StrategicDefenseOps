<?php
namespace App\Services;

use App\Models\User;
use App\Models\Weapon;
use DB;

class WeaponService{
    public function addWeapon($data){
        $weapon=Weapon::create($data);
        if($weapon){
            return $weapon;
        }
        return false;
    }
    public function deleteWeapon($weaponId,$userId){
        $weapon=DB::select('select * from Weapon where authorized_by=? and id=?',[$weaponId,$userId]);
        if($weapon[0]){
            $weapon=DB::find($weapon[0]->id);
            $weapon->delete();
            return true;
        }
        return false;
    }
    public function updateWeapon($data,$weaponId,$userId)
    {
      $user=User::find($userId);
      if($user && $user->role_id==1){
        $weapon=DB::select('select * from weapon where authorized_by=? and id=?',[$userId,$weaponId]);
       

        if($weapon[0]){
            
            $weapon=Weapon::find($weapon[0]->id);
            $weapon->update($data);

            return $weapon;
        }
        return false;
      }
      elseif($user->role_id==2){
        
        $adminId=DB::select('select u.parent_id from users u where u.id=?',[$user->id]);
        if(!$adminId)return false;
        $weapon=DB::select('select * from weapon where authorized_by=? and id=?',[$adminId,$weaponId]);
        if($weapon[0]){
            $weapon=Weapon::find($weapon[0]->id);
            $weapon->update($data);
            
            return $weapon;
        }
        return false;
        
      }
      
      return false;
        
    }
    public function getAllWeapons($userId){
        $user=User::find($userId);
        if($user && $user->role_id==1){
            $weapons=DB::select('select * from weapon where authorized_by=?',[$userId]);
            if($weapons[0]){
                return $weapons;
            }
            return false;
        }
        elseif($user->role_id==2){
            $adminId=DB::select('select u.parent_id from users u where u.id=?',[$userId]);
            if(!$adminId)return false;
            $weapons=DB::select('select * from weapon where authorized_by=?',[$adminId]);
            if($weapons[0]){
                return $weapons;
            }
            return false;
        }
        return false;
    }
    public function getWeaponByName($weaponName,$userId){
        
        $user=User::find($userId);
        if($user && $user->role_id==1){
            $weapon=DB::select('select * from weapon where authorized_by=? and weapon_name LIKE ?',[$userId,'%'.$weaponName.'%']);

            if($weapon[0]){
                return $weapon[0];
            }
            return false;
        }
        elseif($user && $user->role_id==2){
            $adminId=DB::select('select u.parent_id from users u where u.id=?',[$userId]);
            if(!$adminId[0])return false;
            $weapon=DB::select('select * from weapon where authorized_by=? and weapon_name LIKE ?',[$adminId,'%'.$weaponName.'%']);
            if($weapon[0]){
                return $weapon;
            }
            return false;
        }

    }
}