<?php
// --- INI KODE BARU (PENGUNCI HALAMAN) ---
session_start();

// Cek apakah user sudah login, kalau belum tendang ke halaman login
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
// ----------------------------------------

include 'config.php';

if (isset($_GET['cari'])) {
    $keyword = $_GET['cari'];
    // GROUP BY judul sudah dihapus
    $query = "SELECT * FROM berita WHERE judul LIKE '%$keyword%' OR isi LIKE '%$keyword%' ORDER BY id DESC";
    $judul_halaman = "Hasil Pencarian: '" . $keyword . "'";
} elseif (isset($_GET['kategori'])) {
    $kategori = $_GET['kategori'];
    // GROUP BY judul sudah dihapus
    $query = "SELECT * FROM berita WHERE kategori = '$kategori' ORDER BY id DESC";
    $judul_halaman = "Kategori: " . $kategori;
} else {
    // GROUP BY judul sudah dihapus
    $query = "SELECT * FROM berita ORDER BY id DESC";
    $judul_halaman = "Semua Berita Terkini";
}

$result = mysqli_query($conn, $query);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Berita Terkini</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.php">BERITA TERKINI</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSearch">
                
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <span class="nav-link text-light">Halo, <?= $_SESSION['user_nama']; ?></span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-warning fw-bold" href="logout.php">Logout</a>
                    </li>
                </ul>
                <form class="d-flex" action="index.php" method="GET">
                    <input class="form-control me-2" type="search" name="cari" placeholder="Cari berita..." value="<?= isset($_GET['cari']) ? $_GET['cari'] : '' ?>">
                    <button class="btn btn-outline-light" type="submit">Cari</button>
                </form>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="mb-4 text-center">
            <a href="index.php" class="btn btn-secondary m-1">Semua</a>
            <a href="index.php?kategori=Olahraga" class="btn btn-outline-primary m-1">Olahraga</a>
            <a href="index.php?kategori=Ekonomi" class="btn btn-outline-success m-1">Ekonomi</a>
            <a href="index.php?kategori=Teknologi" class="btn btn-outline-info m-1">Teknologi</a>
            <a href="index.php?kategori=Peristiwa" class="btn btn-outline-danger m-1">Peristiwa</a>
            <a href="index.php?kategori=Internasional" class="btn btn-outline-dark m-1">Internasional</a>
            <a href="index.php?kategori=Cuaca" class="btn btn-outline-primary m-1">Cuaca</a>
            <a href="index.php?kategori=Bencana" class="btn btn-outline-warning m-1">Bencana</a>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3><?= $judul_halaman; ?></h3>
            <a href="tambah.php" class="btn btn-success">+ Tambah Berita</a>
        </div>

        <div class="row">
            <?php while($row = mysqli_fetch_assoc($result)) : ?>
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm h-100">
                    
                    <?php if(!empty($row['gambar']) && file_exists('uploads/'.$row['gambar'])) : ?>
                        <img src="uploads/<?= $row['gambar']; ?>" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <?php else: ?>
                        <img src="https://via.placeholder.com/300x200?text=Belum+Ada+Gambar" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <?php endif; ?>

                    <div class="card-body">
                        <span class="badge bg-primary mb-2"><?= $row['kategori']; ?></span>
                        <h5 class="card-title">
                            <a href="detail.php?id=<?= $row['id']; ?>" class="text-decoration-none text-dark">
                                <?= $row['judul']; ?>
                            </a>
                        </h5>
                        <h6 class="card-subtitle mb-2 text-muted">Oleh: <?= $row['penulis']; ?></h6>
                        <p class="card-text">
                            <?= substr($row['isi'], 0, 100) . '...'; ?>
                        </p>
                        <a href="detail.php?id=<?= $row['id']; ?>" class="btn btn-sm btn-primary">Baca Selengkapnya &rarr;</a>
                    </div>
                    
                    <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                        <small class="text-muted"><?= $row['tanggal_upload']; ?></small>
                        
                        <div>
                            <a href="edit.php?id=<?= $row['id']; ?>" class="btn btn-sm btn-warning">Edit</a>
                            <a href="hapus.php?id=<?= $row['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Hapus berita ini?')">Hapus</a>
                        </div>
                    </div>
                </div>
            </div>
            <?php endwhile; ?>
            
            <?php if(mysqli_num_rows($result) == 0): ?>
                <div class="col-12"><div class="alert alert-warning text-center">Belum ada berita di kategori ini.</div></div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>