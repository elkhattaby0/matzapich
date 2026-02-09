<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\FriendshipController;
use App\Models\User;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/email/resend-verification', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
    ]);

    $user = User::where('email', $request->input('email'))->first();

    if (! $user) {
        return response()->json([
            'message' => 'User not found.',
        ], 404);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json([
            'message' => 'Email is already verified.',
        ], 400);
    }

    $user->sendEmailVerificationNotification();

    return response()->json([
        'message' => 'Verification email has been resent.',
    ]);
})->middleware('throttle:6,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::put('/user', [UserController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
    Route::apiResource('users', UserController::class);

    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts', [PostController::class, 'index']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    Route::get('/friends', [FriendshipController::class, 'index']);
    Route::post('/friendships', [FriendshipController::class, 'store']);
    Route::post('/friendships/{friendship}/accept', [FriendshipController::class, 'accept']);
    Route::post('/friendships/{friendship}/reject', [FriendshipController::class, 'reject']);
    Route::delete('/friendships/{friendship}', [FriendshipController::class, 'destroy']);
Route::get('/friend-requests', [FriendshipController::class, 'requests']);
Route::get('/friend-suggestions', [FriendshipController::class, 'suggestions']);
Route::get('/friend-birthdays', [FriendshipController::class, 'birthdays']);
});
