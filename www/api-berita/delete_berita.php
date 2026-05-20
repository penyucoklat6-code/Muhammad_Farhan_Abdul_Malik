<?php
header('Content-Type: application/json');
include 'config.php';

// Menangkap ID berita yang mau dihapus
$id = $_POST['id'];

// Cek apakah ID-nya dikirim atau tidak
if (!$id) {
    echo json_encode(["pesan" => "Gagal: ID berita tidak ditemukan!"]);
    exit;
}

// Perintah SQL untuk menghapus data berdasarkan ID
$query = "DELETE FROM berita WHERE id = '$id'";

if (mysqli_query($conn, $query)) {
    // Cek apakah ada baris yang terhapus (artinya ID-nya memang ada)
    if (mysqli_affected_rows($conn) > 0) {
        echo json_encode(["pesan" => "Berita berhasil dihapus!"]);
    } else {
        echo json_encode(["pesan" => "Gagal: Data dengan ID tersebut tidak ditemukan."]);
    }
} else {
    echo json_encode(["pesan" => "Gagal: " . mysqli_error($conn)]);
}
?>