<?php
header('Content-Type: application/json');

// Ini fungsinya memanggil file config.php yang ada di sebelahnya
include 'config.php'; 

// Mengambil semua data dari tabel 'berita'
$query = "SELECT * FROM berita";
$result = mysqli_query($conn, $query);

// Menampung data dalam bentuk array
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

// Mengubah data menjadi format JSON (teks) agar bisa dibaca aplikasi lain
echo json_encode($data);
?>