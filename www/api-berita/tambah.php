<?php
// --- KODE PENGAMAN (WAJIB DI ATAS) ---
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
// -------------------------------------

include 'config.php';

if (isset($_POST['submit'])) {
    $judul    = $_POST['judul'];
    $slug     = strtolower(str_replace(' ', '-', $judul));
    $isi      = $_POST['isi'];
    $penulis  = $_POST['penulis'];
    $kategori = $_POST['kategori'];
    
    // --- LOGIKA UPLOAD GAMBAR ---
    $gambar = $_FILES['gambar']['name'];
    $nama_gambar_baru = ""; // Default kosong

    if ($gambar != "") {
        // Ambil ekstensi file (contoh: jpg, png)
        $ekstensi_diperbolehkan = array('png','jpg','jpeg');
        $x = explode('.', $gambar);
        $ekstensi = strtolower(end($x));
        $file_tmp = $_FILES['gambar']['tmp_name'];
        $angka_acak = rand(1,999);
        $nama_gambar_baru = $angka_acak . '-' . $gambar; // Biar nama file unik

        if (in_array($ekstensi, $ekstensi_diperbolehkan) === true) {
            // Pindahkan file ke folder uploads
            move_uploaded_file($file_tmp, 'uploads/' . $nama_gambar_baru);
        } else {
            echo "<script>alert('Ekstensi gambar hanya boleh jpg, jpeg, atau png.'); window.location='tambah.php';</script>";
            exit;
        }
    }

    // Masukkan ke database (termasuk nama gambar)
    $query = "INSERT INTO berita (judul, slug, isi, penulis, kategori, gambar, tanggal_upload) 
              VALUES ('$judul', '$slug', '$isi', '$penulis', '$kategori', '$nama_gambar_baru', NOW())";
    
    if (mysqli_query($conn, $query)) {
        echo "<script>alert('Berita Berhasil Ditambah!'); window.location='index.php';</script>";
    } else {
        echo "Gagal: " . mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Tambah Berita</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="card mx-auto" style="max-width: 600px;">
            <div class="card-header bg-success text-white">
                <h4>Form Tambah Berita</h4>
            </div>
            <div class="card-body">
                <form method="POST" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label>Judul Berita</label>
                        <input type="text" name="judul" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>Penulis</label>
                        <input type="text" name="penulis" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>Kategori</label>
                        <select name="kategori" class="form-select">
                            <option value="Peristiwa">Peristiwa</option>
                            <option value="Ekonomi">Ekonomi</option>
                            <option value="Olahraga">Olahraga</option>
                            <option value="Teknologi">Teknologi</option>
                            <option value="Internasional">Internasional</option>
                            <option value="Cuaca">Cuaca</option>
                            <option value="Bencana">Bencana</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label>Gambar / Foto Berita</label>
                        <input type="file" name="gambar" class="form-control" accept="image/*">
                    </div>
                    <div class="mb-3">
                        <label>Isi Berita</label>
                        <textarea name="isi" class="form-control" rows="5" required></textarea>
                    </div>
                    <button type="submit" name="submit" class="btn btn-primary w-100">SIMPAN BERITA</button>
                    <a href="index.php" class="btn btn-secondary w-100 mt-2">Kembali</a>
                </form>
            </div>
        </div>
    </div>
</body>
</html>