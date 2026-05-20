<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/api/auth/register', 'POST', [
    'name' => 'Kaprodi Test',
    'email' => 'kaprodi.test@uhamka.ac.id',
    'password' => 'password123',
    'password_confirmation' => 'password123',
    'role' => 'kaprodi',
    'nip' => '1234567890'
]);
$response = $kernel->handle($request);
echo $response->getContent();
