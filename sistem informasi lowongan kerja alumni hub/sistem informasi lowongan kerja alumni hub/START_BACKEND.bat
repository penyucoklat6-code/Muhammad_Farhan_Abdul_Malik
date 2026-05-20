@echo off
chcp 65001 >nul
title AlumniHub — Backend Laravel
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║           AlumniHub UHAMKA — Backend Laravel         ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
echo  [1/4] Masuk ke folder backend...
cd /d "D:\D-Documents\Dokumen sampingan\Reja\sistem informasi lowongan kerja alumni hub\alumnihub-backend"

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Folder backend tidak ditemukan!
    echo  Pastikan path sudah benar.
    pause
    exit
)

echo  [1/4] OK - Folder backend ditemukan
echo.

echo  [2/4] Membersihkan cache konfigurasi...
php artisan config:clear
php artisan cache:clear
echo  [2/4] OK - Cache dibersihkan
echo.

echo  [3/4] Menjalankan migrasi database (membuat tabel)...
php artisan migrate --force
echo  [3/4] OK - Database siap
echo.

echo  [4/4] Menjalankan server Laravel...
echo.
echo  ════════════════════════════════════════════════════════
echo   Backend berjalan di: http://localhost:8000
echo   Jangan tutup jendela ini selama website digunakan!
echo  ════════════════════════════════════════════════════════
echo.
php artisan serve
pause
