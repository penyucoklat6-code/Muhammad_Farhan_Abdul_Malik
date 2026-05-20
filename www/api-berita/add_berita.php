<?php
header('Content-Type: application/json');
include 'config.php';

// Menangkap data yang dikirim
$judul    = $_POST['judul'];
$slug     = $_POST['slug'];
$isi      = $_POST['isi'];
$penulis  = $_POST['penulis'];
$kategori = $_POST['kategori'];

// Masukkan ke database
$query = "INSERT INTO berita (judul, slug, isi, penulis, kategori, tanggal_upload) 
          VALUES ('$judul', '$slug', '$isi', '$penulis', '$kategori', NOW())";

if (mysqli_query($conn, $query)) {
    echo json_encode(["pesan" => "Berita berhasil ditambahkan!"]);
} else {
    echo json_encode(["pesan" => "Gagal: " . mysqli_error($conn)]);
}
?>