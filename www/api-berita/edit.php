<?php
// --- KODE PENGAMAN (WAJIB DI ATAS) ---
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
// -------------------------------------

include 'config.php';

// Ambil ID berita dari URL
$id = $_GET['id'];

// Tarik data berita lama dari database
$query_select = "SELECT * FROM berita WHERE id = '$id'";
$result_select = mysqli_query($conn, $query_select);
$data = mysqli_fetch_assoc($result_select);

// Jika tombol UPDATE ditekan
if (isset($_POST['submit'])) {
    $judul    = $_POST['judul'];
    $slug     = strtolower(str_replace(' ', '-', $judul));
    $isi      = $_POST['isi'];
    $penulis  = $_POST['penulis'];
    $kategori = $_POST['kategori'];
    
    // Cek apakah ada gambar baru yang diupload
    $gambar = $_FILES['gambar']['name'];

    if ($gambar != "") {
        // --- JIKA USER UPLOAD GAMBAR BARU ---
        $ekstensi_diperbolehkan = array('png','jpg','jpeg');
        $x = explode('.', $gambar);
        $ekstensi = strtolower(end($x));
        $file_tmp = $_FILES['gambar']['tmp_name'];
        $angka_acak = rand(1,999);
        $nama_gambar_baru = $angka_acak . '-' . $gambar;

        if (in_array($ekstensi, $ekstensi_diperbolehkan) === true) {
            move_uploaded_file($file_tmp, 'uploads/' . $nama_gambar_baru);
            
            // Simpan data + gambar baru
            $query = "UPDATE berita SET judul = '$judul', slug = '$slug', isi = '$isi', penulis = '$penulis', kategori = '$kategori', gambar = '$nama_gambar_baru' WHERE id = '$id'";
        } else {
            echo "<script>alert('Ekstensi gambar hanya boleh jpg, jpeg, atau png.'); window.location='edit.php?id=$id';</script>";
            exit;
        }
    } else {
        // --- JIKA USER TIDAK UPLOAD GAMBAR BARU (Cuma ubah teks) ---
        $query = "UPDATE berita SET judul = '$judul', slug = '$slug', isi = '$isi', penulis = '$penulis', kategori = '$kategori' WHERE id = '$id'";
    }
    
    if (mysqli_query($conn, $query)) {
        echo "<script>alert('Berita Berhasil Diupdate!'); window.location='index.php';</script>";
    } else {
        echo "Gagal: " . mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Edit Berita</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5 mb-5">
        <div class="card mx-auto" style="max-width: 600px;">
            <div class="card-header bg-warning text-dark fw-bold">
                <h4>Form Edit Berita</h4>
            </div>
            <div class="card-body">
                <form method="POST" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label>Judul Berita</label>
                        <input type="text" name="judul" class="form-control" value="<?= $data['judul']; ?>" required>
                    </div>
                    <div class="mb-3">
                        <label>Penulis</label>
                        <input type="text" name="penulis" class="form-control" value="<?= $data['penulis']; ?>" required>
                    </div>
                    <div class="mb-3">
                        <label>Kategori</label>
                        <select name="kategori" class="form-select">
                            <option value="Peristiwa" <?= ($data['kategori'] == 'Peristiwa') ? 'selected' : ''; ?>>Peristiwa</option>
                            <option value="Ekonomi" <?= ($data['kategori'] == 'Ekonomi') ? 'selected' : ''; ?>>Ekonomi</option>
                            <option value="Olahraga" <?= ($data['kategori'] == 'Olahraga') ? 'selected' : ''; ?>>Olahraga</option>
                            <option value="Teknologi" <?= ($data['kategori'] == 'Teknologi') ? 'selected' : ''; ?>>Teknologi</option>
                            <option value="Internasional" <?= ($data['kategori'] == 'Internasional') ? 'selected' : ''; ?>>Internasional</option>
                            <option value="Cuaca" <?= ($data['kategori'] == 'Cuaca') ? 'selected' : ''; ?>>Cuaca</option>
                            <option value="Bencana" <?= ($data['kategori'] == 'Bencana') ? 'selected' : ''; ?>>Bencana</option>
                        </select>
                    </div>
                    
                    <div class="mb-3 border p-3 bg-white rounded">
                        <label class="fw-bold">Gambar Saat Ini:</label><br>
                        <?php if(!empty($data['gambar']) && file_exists('uploads/'.$data['gambar'])) : ?>
                            <img src="uploads/<?= $data['gambar']; ?>" width="150" class="mt-2 mb-2 rounded shadow-sm">
                        <?php else: ?>
                            <span class="text-danger d-block mt-2 mb-2">Belum ada gambar</span>
                        <?php endif; ?>
                        
                        <label class="mt-2">Ganti / Tambah Gambar Baru</label>
                        <input type="file" name="gambar" class="form-control" accept="image/*">
                        <small class="text-muted">Biarkan kosong jika tidak ingin mengubah gambar.</small>
                    </div>

                    <div class="mb-3">
                        <label>Isi Berita</label>
                        <textarea name="isi" class="form-control" rows="8" required><?= $data['isi']; ?></textarea>
                    </div>
                    <button type="submit" name="submit" class="btn btn-warning w-100 fw-bold">UPDATE BERITA</button>
                    <a href="index.php" class="btn btn-secondary w-100 mt-2">Batal / Kembali</a>
                </form>
            </div>
        </div>
    </div>
</body>
</html>