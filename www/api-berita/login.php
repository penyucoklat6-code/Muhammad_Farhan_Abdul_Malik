<?php
include 'config.php';
session_start();

// Jika sudah login, lempar ke index
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

$error = '';

if (isset($_POST['login'])) {
    $email = strtolower($_POST['email']);
    $password = $_POST['password'];

    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) === 1) {
        $row = mysqli_fetch_assoc($result);
        // Cek kecocokan password
        if (password_verify($password, $row['password'])) {
            // Set Session (Tiket Masuk)
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['user_nama'] = $row['nama'];
            
            header("Location: index.php");
            exit;
        } else {
            $error = "Password salah!";
        }
    } else {
        $error = "Email tidak ditemukan!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login - Portal Berita UHAMKA</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style> body { background-color: #f4f6f9; } </style>
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow p-4 border-0" style="width: 400px; border-radius: 10px;">
        <h4 class="text-center mb-2 fw-bold">Portal UHAMKA</h4>
        <p class="text-center text-muted mb-4" style="font-size: 14px;">Silakan login untuk melanjutkan, jangan lupa gunakan email @uhamka.ac.id ya!</p>

        <?php if($error) echo "<div class='alert alert-danger py-2'>$error</div>"; ?>

        <form method="POST">
            <div class="mb-3">
                <input type="email" name="email" class="form-control p-2" placeholder="👤 Email" required>
            </div>
            <div class="mb-4">
                <input type="password" name="password" class="form-control p-2" placeholder="🔒 Password" required>
            </div>
            <button type="submit" name="login" class="btn btn-primary w-100 fw-bold py-2">Login</button>
        </form>
        <div class="text-center mt-4">
            <small>Belum punya akun? <a href="register.php" class="text-decoration-none">Register Mahasiswa</a></small>
        </div>
    </div>
</body>
</html>