<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProfileService
{
    public function updateProfile($user, $data)
    {
        $response = $user->update($data);

        return $response;
    }

    public function deleteProfile($userId)
    {
        $user=User::find($userId);
        DB::update('update  users set parent_id=? where parent_id=?', [null, $user->id]);
      
        $response = $user->delete();

        return $response;
    }
}
