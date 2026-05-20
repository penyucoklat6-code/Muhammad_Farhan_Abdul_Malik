<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status Lowongan AlumniHub</title>
    <style>
        body { font-family: 'Georgia', 'Times New Roman', serif; background: #f4f7fb; margin: 0; padding: 0; color: #2d3748; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 0; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { padding: 32px 40px; text-align: center; }
        .header.approve  { background: #1a3a2a; }
        .header.rejected { background: #742a2a; }
        .header.revision { background: #744210; }
        .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
        .header p  { color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 40px; line-height: 1.8; }
        .salutation { font-size: 15px; color: #2d3748; margin-bottom: 20px; }
        .content-text { font-size: 14px; color: #4a5568; line-height: 1.9; margin-bottom: 16px; }
        .job-card { background: #f7fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2f855a; padding: 18px 20px; margin: 24px 0; }
        .job-title { font-size: 16px; font-weight: 700; color: #1a202c; margin: 0 0 4px; }
        .job-company { font-size: 13px; color: #718096; }
        .status-badge { display: inline-block; padding: 6px 20px; border-radius: 4px; font-size: 13px; font-weight: 700; margin: 16px 0; letter-spacing: 0.5px; text-transform: uppercase; }
        .badge-approve  { background: #f0fff4; color: #276749; border: 1px solid #9ae6b4; }
        .badge-rejected { background: #fff5f5; color: #9b2c2c; border: 1px solid #feb2b2; }
        .badge-revision { background: #fffff0; color: #744210; border: 1px solid #fefcbf; }
        .reason-box { background: #fffff0; border-left: 4px solid #d69e2e; padding: 16px 18px; margin: 20px 0; font-size: 14px; color: #744210; line-height: 1.8; }
        .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
        .closing { font-size: 14px; color: #2d3748; margin-top: 28px; line-height: 1.8; }
        .closing strong { display: block; margin-top: 4px; }
        .footer { background: #f7fafc; padding: 20px 40px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header {{ $review->status === 'approve' ? 'approve' : ($review->status === 'rejected' ? 'rejected' : 'revision') }}">
            @if($review->status === 'approve')
                <h1>Lowongan Disetujui &amp; Dipublikasikan</h1>
            @elseif($review->status === 'rejected')
                <h1>Pemberitahuan Penolakan Lowongan</h1>
            @else
                <h1>Pemberitahuan Revisi Lowongan</h1>
            @endif
            <p>AlumniHub UHAMKA &mdash; Notifikasi Resmi</p>
        </div>
        <div class="body">
            <p class="salutation">Yth. Bapak/Ibu <strong>{{ $job->user->name }}</strong>,</p>

            <p class="content-text">Dengan hormat,</p>

            <p class="content-text">
                Berikut kami sampaikan hasil peninjauan terhadap lowongan pekerjaan yang telah Anda ajukan melalui sistem AlumniHub:
            </p>

            <div class="job-card">
                <div class="job-title">{{ $job->title }}</div>
                <div class="job-company">{{ $job->company }} &mdash; {{ $job->location }}</div>
            </div>

            @if($review->status === 'approve')
                <span class="status-badge badge-approve">DISETUJUI</span>
                <p class="content-text">
                    Setelah melalui proses verifikasi oleh Kaprodi, lowongan Anda dinyatakan <strong>telah memenuhi ketentuan</strong> dan kini resmi <strong>dipublikasikan pada platform AlumniHub</strong>.
                </p>
                <p class="content-text">
                    Lowongan ini sudah dapat dilihat dan dilamar oleh seluruh mahasiswa. Anda dapat memantau jumlah pelamar melalui menu <strong>Kelola Lowongan</strong> pada dashboard Anda.
                </p>

            @elseif($review->status === 'rejected')
                <span class="status-badge badge-rejected">DITOLAK</span>
                <p class="content-text">
                    Mohon maaf, setelah melalui proses peninjauan, lowongan yang Anda ajukan <strong>belum dapat dipublikasikan</strong> pada platform AlumniHub untuk saat ini.
                </p>
                <p class="content-text">
                    Keputusan ini diambil berdasarkan pertimbangan kesesuaian dengan kebijakan dan standar yang berlaku. Anda dipersilakan untuk mengajukan lowongan baru yang telah disesuaikan dengan ketentuan yang ada.
                </p>

            @else
                <span class="status-badge badge-revision">PERLU REVISI</span>
                <p class="content-text">
                    Lowongan yang Anda ajukan memerlukan beberapa <strong>perbaikan</strong> sebelum dapat dipublikasikan. Mohon untuk meninjau dan memperbarui informasi lowongan sesuai dengan catatan yang diberikan oleh Kaprodi.
                </p>
                <p class="content-text">
                    Setelah melakukan revisi, lowongan akan secara otomatis diajukan kembali untuk proses peninjauan ulang.
                </p>
            @endif

            @if($review->reason)
                <div class="reason-box">
                    <strong>Catatan dari Kaprodi:</strong><br>
                    {{ $review->reason }}
                </div>
            @endif

            <hr class="divider">

            <div class="closing">
                Hormat kami,<br>
                <strong>Kaprodi — AlumniHub UHAMKA</strong>
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
