<?php

namespace App\Services;
use App\Models\User;

class UserDetailsService{
    public function getUserDetails($userId){
        $user= User::where('id',$userId)->first();
        if($user){
            return $user;
        }
        return null;
        
    }
}