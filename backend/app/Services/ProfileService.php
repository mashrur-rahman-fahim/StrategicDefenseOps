<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ProfileService
{
    public function updateProfile($user, $data)
    {
        $response = $user->update($data);

        return $response;
    }

    public function deleteProfile($user)
    {
        DB::update('update from users set parent_id=? where parent_id=?', [null, $user->id]);
        $response = $user->delete();

        return $response;
    }
}
