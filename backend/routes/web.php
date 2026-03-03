<?php

use Illuminate\Support\Facades\Route;

// This catch-all route will serve the React frontend for all web requests.
// API routes are defined in api.php and are automatically prefixed with /api.
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
