<?php

echo "Testing Storage Setup...<br>";

$publicStorage = __DIR__ . '/storage';
if (file_exists($publicStorage)) {
    echo "public/storage exists.<br>";
    if (is_link($publicStorage)) {
        echo "It is a symlink.<br>";
    } else {
        echo "It is NOT a symlink, it's a regular directory. This is the problem!<br>";
    }
} else {
    echo "public/storage does NOT exist.<br>";
}

$appPublic = dirname(__DIR__) . '/storage/app/public';
echo "<br>Contents of storage/app/public:<br>";
if (file_exists($appPublic)) {
    $files = scandir($appPublic);
    foreach ($files as $file) {
        echo $file . "<br>";
    }
} else {
    echo "storage/app/public does NOT exist.<br>";
}

// Let's also output all users and their avatars to see what's in DB
require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

echo "<br>DB Users Avatars:<br>";
try {
    $users = \App\Models\User::all();
    foreach ($users as $u) {
        echo "User {$u->id}: avatar = {$u->avatar}<br>";
    }
} catch (\Exception $e) {
    echo "DB Error: " . $e->getMessage();
}

