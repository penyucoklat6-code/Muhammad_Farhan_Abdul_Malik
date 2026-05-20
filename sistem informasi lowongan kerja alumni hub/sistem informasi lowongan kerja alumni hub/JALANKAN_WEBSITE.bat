@echo off
chcp 65001 >nul
title AlumniHub — Launcher Utama
color 0E

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║         AlumniHub UHAMKA — Jalankan Semua           ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
echo  Script ini akan membuka 2 jendela terminal:
echo  - Jendela HIJAU  = Backend Laravel (port 8000)
echo  - Jendela BIRU   = Frontend React  (port 5173)
echo.
echo  PASTIKAN TERLEBIH DAHULU:
echo  [x] XAMPP sudah dibuka dan MySQL sudah START
echo  [x] Database alumni_hub sudah dibuat di phpMyAdmin
echo  [x] File .env sudah diisi dengan Gmail App Password
echo.
echo  Tekan tombol apapun untuk mulai...
pause >nul

echo.
echo  Membuka Backend Laravel...
start "AlumniHub Backend" cmd /k "chcp 65001 >nul && color 0A && cd /d "D:\D-Documents\Dokumen sampingan\Reja\sistem informasi lowongan kerja alumni hub\alumnihub-backend" && echo [Backend] Membersihkan cache... && php artisan config:clear && php artisan cache:clear && echo [Backend] Menjalankan migrasi... && php artisan migrate --force && echo. && echo  Server Laravel berjalan di http://localhost:8000 && echo  Jangan tutup jendela ini! && echo. && php artisan serve"

echo  Backend sedang disiapkan, tunggu 5 detik...
timeout /t 5 /nobreak >nul

echo  Membuka Frontend React...
start "AlumniHub Frontend" cmd /k "chcp 65001 >nul && color 0B && cd /d "D:\D-Documents\Dokumen sampingan\Reja\sistem informasi lowongan kerja alumni hub\alumnihub-frontend" && echo. && echo  Server React berjalan di http://localhost:5173 && echo  Jangan tutup jendela ini! && echo. && npm run dev"

echo.
echo  ════════════════════════════════════════════════════════
echo.
echo  Kedua server sedang disiapkan...
echo  Tunggu sekitar 10 detik, lalu buka browser:
echo.
echo      http://localhost:5173
echo.
echo  ════════════════════════════════════════════════════════
echo.
timeout /t 10 /nobreak >nul

echo  Membuka browser secara otomatis...
start "" "http://localhost:5173"

echo.
echo  Website AlumniHub sudah terbuka di browser!
echo  Jangan tutup 2 jendela terminal yang sudah terbuka.
echo.
pause
