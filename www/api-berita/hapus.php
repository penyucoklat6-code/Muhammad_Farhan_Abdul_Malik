<?php
// --- KODE PENGAMAN (WAJIB DI ATAS) ---
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
// -------------------------------------

include 'config.php';

$id = $_GET['id']; // Ambil ID dari tombol yang diklik

// --- BONUS: Cek dan hapus file foto dari folder 'uploads' ---
$query_gambar = "SELECT gambar FROM berita WHERE id = '$id'";
$result_gambar = mysqli_query($conn, $query_gambar);
$row = mysqli_fetch_assoc($result_gambar);

if ($row['gambar'] != "" && file_exists("uploads/" . $row['gambar'])) {
    unlink("uploads/" . $row['gambar']); // Perintah hapus file fisik
}
// -----------------------------------------------------------

// Hapus data dari database
$query = "DELETE FROM berita WHERE id = '$id'";

if (mysqli_query($conn, $query)) {
    echo "<script>alert('Data beserta fotonya berhasil dihapus!'); window.location='index.php';</script>";
} else {
    echo "Gagal menghapus data.";
}
?>