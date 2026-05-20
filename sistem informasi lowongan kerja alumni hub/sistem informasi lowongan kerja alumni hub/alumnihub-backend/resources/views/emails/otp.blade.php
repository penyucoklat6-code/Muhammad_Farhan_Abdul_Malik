<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP AlumniHub</title>
    <style>
        body { font-family: 'Georgia', 'Times New Roman', serif; background: #f4f7fb; margin: 0; padding: 0; color: #2d3748; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 0; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: #1a3a2a; padding: 32px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px; }
        .header p { color: #a7c4b5; margin: 6px 0 0; font-size: 13px; letter-spacing: 0.5px; }
        .body { padding: 40px; line-height: 1.8; }
        .salutation { font-size: 15px; color: #2d3748; margin-bottom: 20px; }
        .otp-box { background: #f0faf4; border: 2px solid #2f855a; border-radius: 8px; padding: 28px; text-align: center; margin: 28px 0; }
        .otp-label { font-size: 12px; color: #718096; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; font-family: 'Segoe UI', Arial, sans-serif; }
        .otp-code { font-size: 44px; font-weight: 800; letter-spacing: 12px; color: #1a3a2a; font-family: 'Courier New', monospace; }
        .content-text { font-size: 14px; color: #4a5568; line-height: 1.9; margin-bottom: 16px; }
        .warning-box { background: #fffbeb; border-left: 4px solid #d69e2e; padding: 14px 18px; margin: 24px 0; font-size: 13px; color: #744210; line-height: 1.7; }
        .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
        .closing { font-size: 14px; color: #2d3748; margin-top: 28px; line-height: 1.8; }
        .closing strong { display: block; margin-top: 4px; }
        .footer { background: #f7fafc; padding: 20px 40px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AlumniHub UHAMKA</h1>
            <p>Sistem Informasi Lowongan Kerja</p>
        </div>
        <div class="body">
            <p class="salutation">Yth. Bapak/Ibu <strong>{{ $user->name }}</strong>,</p>

            <p class="content-text">
                Kode OTP (<em>One Time Password</em>) Anda adalah:
            </p>

            <div class="otp-box">
                <div class="otp-label">Kode Verifikasi</div>
                <div class="otp-code">{{ $otp->otp_code }}</div>
            </div>

            <p class="content-text">
                Kode ini bersifat <strong>rahasia</strong> dan hanya berlaku selama <strong>5 menit</strong>.
                Mohon untuk tidak membagikan kode ini kepada pihak mana pun demi menjaga keamanan akun Anda.
            </p>

            <p class="content-text">
                Kedaluwarsa pada: <strong>{{ $otp->expired_at->format('H:i, d M Y') }}</strong>
            </p>

            <div class="warning-box">
                <strong>⚠ Perhatian:</strong> Apabila Anda tidak merasa melakukan permintaan ini, silakan abaikan pesan ini.
                Tim AlumniHub tidak pernah meminta kode OTP Anda melalui telepon atau pesan langsung.
            </div>

            <hr class="divider">

            <div class="closing">
                Hormat kami,<br>
                <strong>Tim Rekrutmen AlumniHub</strong>
                <span style="font-size: 13px; color: #718096;">Universitas Muhammadiyah Prof. DR. HAMKA</span>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} AlumniHub UHAMKA. Hak Cipta Dilindungi.<br>
            Email ini dikirim secara otomatis, mohon tidak membalas pesan ini.
        </div>
    </div>
</body>
</html>
