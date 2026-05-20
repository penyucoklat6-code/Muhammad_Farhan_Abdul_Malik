<?php
include 'config.php';
session_start();

// Jika sudah login, lempar ke index
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

$error = '';
$success = '';

if (isset($_POST['register'])) {
    $nama = $_POST['nama'];
    $email = strtolower($_POST['email']);
    $password = $_POST['password'];

    // LOGIKA 1: Cek apakah email pakai domain @uhamka.ac.id
    $domain = explode('@', $email);
    if (end($domain) !== 'uhamka.ac.id') {
        $error = "Gagal! Wajib menggunakan email @uhamka.ac.id";
    } else {
        // LOGIKA 2: Cek apakah email sudah terdaftar
        $cek_email = mysqli_query($conn, "SELECT * FROM users WHERE email = '$email'");
        if (mysqli_num_rows($cek_email) > 0) {
            $error = "Email sudah terdaftar! Silakan login.";
        } else {
            // Hash password biar aman
            $password_hashed = password_hash($password, PASSWORD_DEFAULT);
            $query = "INSERT INTO users (nama, email, password) VALUES ('$nama', '$email', '$password_hashed')";
            
            if (mysqli_query($conn, $query)) {
                $success = "Pendaftaran berhasil! Silakan Login.";
            } else {
                $error = "Terjadi kesalahan sistem.";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Register - Portal Berita UHAMKA</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style> body { background-color: #f4f6f9; } </style>
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow p-4" style="width: 400px; border-radius: 10px;">
        <h4 class="text-center mb-1 fw-bold">Daftar Akun</h4>
        <p class="text-center text-muted mb-4" style="font-size: 14px;">Gunakan email @uhamka.ac.id</p>

        <?php if($error) echo "<div class='alert alert-danger py-2'>$error</div>"; ?>
        <?php if($success) echo "<div class='alert alert-success py-2'>$success</div>"; ?>

        <form method="POST">
            <div class="mb-3">
                <input type="text" name="nama" class="form-control" placeholder="Nama Lengkap" required>
            </div>
            <div class="mb-3">
                <input type="email" name="email" class="form-control" placeholder="Email (@uhamka.ac.id)" required>
            </div>
            <div class="mb-4">
                <input type="password" name="password" class="form-control" placeholder="Password" required>
            </div>
            <button type="submit" name="register" class="btn btn-primary w-100 fw-bold">Daftar</button>
        </form>
        <div class="text-center mt-3">
            <small>Sudah punya akun? <a href="login.php" class="text-decoration-none">Login di sini</a></small>
        </div>
    </div>
</body>
</html>