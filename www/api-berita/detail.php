<?php
// --- KODE PENGAMAN (WAJIB DI ATAS) ---
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
// -------------------------------------

include 'config.php';

// Ambil ID dari URL
$id = $_GET['id'];

// Ambil data berita berdasarkan ID
$query = "SELECT * FROM berita WHERE id = '$id'";
$result = mysqli_query($conn, $query);
$data = mysqli_fetch_assoc($result);

// Kalau data tidak ditemukan (misal ID ngawur), kembalikan ke index
if (!$data) {
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $data['judul']; ?> - Berita Terkini</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

    <nav class="navbar navbar-dark bg-primary mb-4">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.php">&larr; KEMBALI KE BERITA TERKINI</a>
        </div>
    </nav>

    <div class="container mt-4 mb-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow border-0">
                    
                    <?php if($data['gambar'] != "" && file_exists('uploads/'.$data['gambar'])) : ?>
                        <img src="uploads/<?= $data['gambar']; ?>" class="card-img-top" style="max-height: 450px; object-fit: cover; width: 100%;">
                    <?php endif; ?>
                    <div class="card-body p-5">
                        <span class="badge bg-warning text-dark mb-2"><?= $data['kategori']; ?></span>
                        <h1 class="fw-bold mb-3"><?= $data['judul']; ?></h1>
                        
                        <div class="text-muted border-bottom pb-3 mb-4">
                            <small>
                                👤 Penulis: <strong><?= $data['penulis']; ?></strong> &nbsp; | &nbsp; 
                                📅 <?= $data['tanggal_upload']; ?>
                            </small>
                        </div>

                        <div class="mt-4" style="line-height: 1.8; font-size: 1.1rem; color: #333;">
                            <?= nl2br($data['isi']); ?>
                        </div>
                    </div>
                    
                    <div class="card-footer text-center bg-white py-4">
                        <a href="index.php" class="btn btn-outline-primary px-4">Kembali ke Daftar Berita</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
</html>