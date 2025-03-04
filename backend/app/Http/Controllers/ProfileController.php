<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ProfileService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    //
    protected ProfileService $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    public function updateProfile(Request $request)
    {
        $user = User::find(auth()->id());
        $data = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|string',

        ]);
        $updatedUser = $this->profileService->updateProfile($user, $data);

        return response()->json(['message' => 'Profile updated successfully', 'user' => $updatedUser]);
    }

    public function deleteProfile()
    {
        $user = auth()->id();
        $result = $this->profileService->deleteProfile($user);
        if (! $result) {
            return response()->json(['message' => 'Error deleting profile']);
        }

        return response()->json(['message' => 'Profile deleted successfully']);
    }
}
