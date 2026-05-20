<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route khusus untuk Bypass Symlink (Bug PHP Windows)
Route::get('/media/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    if (!file_exists($fullPath)) {
        abort(404);
    }
    
    $mimeType = \Illuminate\Support\Facades\File::mimeType($fullPath);
    return response()->file($fullPath, [
        'Content-Type' => $mimeType,
        'Access-Control-Allow-Origin' => '*'
    ]);
})->where('path', '.*');
