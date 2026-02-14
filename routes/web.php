<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;

Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    if (! URL::hasValidSignature($request)) {
        abort(403, 'Invalid or expired verification link.');
    }

    $user = User::findOrFail($id);

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification signature.');
    }

    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Verified($user));
    }

    $frontendUrl = env('FRONTEND_URL', 'http://127.0.0.1:5173');

    return redirect($frontendUrl . '/login?verified=1');
})->name('verification.verify');

/**
 * حل Route [login] not defined
 * نخلي أي redirect للـ login يروح لنفس welcome (اللي يحمل React/Vite)
 */
Route::get('/login', function () {
    return view('welcome');
})->name('login');

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
