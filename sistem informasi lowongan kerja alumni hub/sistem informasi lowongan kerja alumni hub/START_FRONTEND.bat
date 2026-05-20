@echo off
chcp 65001 >nul
title AlumniHub — Frontend React
color 0B

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║          AlumniHub UHAMKA — Frontend React           ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
echo  [1/2] Masuk ke folder frontend...
cd /d "D:\D-Documents\Dokumen sampingan\Reja\sistem informasi lowongan kerja alumni hub\alumnihub-frontend"

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Folder frontend tidak ditemukan!
    echo  Pastikan path sudah benar.
    pause
    exit
)

echo  [1/2] OK - Folder frontend ditemukan
echo.

echo  [2/2] Menjalankan server React...
echo.
echo  ════════════════════════════════════════════════════════
echo   Frontend berjalan di: http://localhost:5173
echo   Buka browser dan ketik alamat di atas!
echo   Jangan tutup jendela ini selama website digunakan!
echo  ════════════════════════════════════════════════════════
echo.
npm run dev
pause
