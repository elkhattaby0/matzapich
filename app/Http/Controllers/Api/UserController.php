<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash; 

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        return response()->json($request->user());  
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $profileRules = [
            'firstName'     => 'sometimes|nullable|string|max:255',
            'lastName'      => 'sometimes|nullable|string|max:255',
            'dateOfBirth'   => 'sometimes|nullable|date',
            'gender'        => 'sometimes|nullable|in:male,female,other',
            'bio'           => 'sometimes|nullable|string|max:1000',
            'socialStatus'  => 'sometimes|nullable|string',
            'from'          => 'sometimes|nullable|string|max:255',
            'livesIn'       => 'sometimes|nullable|string|max:255',
            'work'          => 'sometimes|nullable|string|max:255',
            'studied'       => 'sometimes|nullable|string|max:255',
            'phone'         => 'sometimes|nullable|string|max:20',
            'avatar'        => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ];

        $passwordRules = [];
        if ($request->filled('oldPassword') && $request->filled('newPassword')) {
            $passwordRules = [
                'oldPassword'     => 'required|string',
                'newPassword'     => 'required|string|min:8',
                'confirmPassword' => 'required|string|same:newPassword',
            ];
        }

        $validated = $request->validate(
            array_merge($profileRules, $passwordRules),
            [
                'newPassword.min'    => 'New password must be at least 8 characters.',
                'confirmPassword.same' => 'Passwords do not match.',
            ]
        );

        if (isset($validated['oldPassword']) && isset($validated['newPassword'])) {
            if (!Hash::check($request->oldPassword, $user->password)) {
                return response()->json(['error' => 'Old password is incorrect'], 422);
            }
            $user->password = Hash::make($request->newPassword);
        }

        // handle avatar file
        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public'); // e.g. "avatars/xxx.webp"
            $user->avatar = $path;
        }

        unset($validated['oldPassword'], $validated['newPassword'], $validated['confirmPassword']);
        unset($validated['avatar']); // we handled file manually

        $user->fill($validated);
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }



    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        $user = $request->user();

        if($user->avatar && Storage::disk('public')->exists($user->avatar))
        {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->avatar = $path;
        $user->save();

        return response()->json([
            'message' => 'Avatar uploaded successfully',
            'avatar_url' => asset('storage/' . $path),
            'user' => $user
        ]);
    }
}
