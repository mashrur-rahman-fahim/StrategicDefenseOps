<?php

namespace App\Http\Controllers;

use App\Services\UserDetailsService;
use Illuminate\Http\Request;


class UserDetailsController extends Controller
{
    
    protected UserDetailsService $userDetailsService;
    public function __construct(UserDetailsService $userDetailsService){
        $this->userDetailsService = $userDetailsService;
    }
    public function getUserDetails(Request $request){
        $user=$this->userDetailsService->getUserDetails(auth()->id());
        if($user){
            return response()->json([
                'message' =>'user details',
                $user
            ]);
        }
        return response()->json([
            'message'=> 'user not found'
        ]);
    }
}
