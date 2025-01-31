<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SocialiteController extends Controller
{
    public function googleLogin(){
        return Socialite::driver('google')->redirect();
    }

    public function googleAuthentication(){
        try{
            $googleUser = Socialite::driver('google')->user();

        $user = User::where('google_id',$googleUser->id)->first();
        if($user){
            Auth::login($user);
            return redirect()->route('dashboard');
        }else{
            $userData = User::create([
                'name' =>  $googleUser ->name,
                'email' =>  $googleUser ->email,
                'password' => Hash::make('password'),
                'role_id'=> 1,
                'parent_id'=> null,
            ]);

            if($userData){
                Auth::login($userData);
                return redirect()->route('dashboard');}
        }



        }catch(Exception $e){
             dd($e);
        }
    }
}
