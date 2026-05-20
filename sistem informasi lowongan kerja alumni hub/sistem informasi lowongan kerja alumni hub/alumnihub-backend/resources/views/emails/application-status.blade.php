<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status Lamaran AlumniHub</title>
    <style>
        body { font-family: 'Georgia', 'Times New Roman', serif; background: #f4f7fb; margin: 0; padding: 0; color: #2d3748; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 0; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { padding: 32px 40px; text-align: center; }
        .header.dikirim   { background: #1a3a2a; }
        .header.interview { background: #2c5282; }
        .header.diterima  { background: #1a3a2a; }
        .header.ditolak   { background: #742a2a; }
        .header.diproses  { background: #2d3748; }
        .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
        .header p  { color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 40px; line-height: 1.8; }
        .salutation { font-size: 15px; color: #2d3748; margin-bottom: 20px; }
        .content-text { font-size: 14px; color: #4a5568; line-height: 1.9; margin-bottom: 16px; }
        .job-card { background: #f7fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2f855a; padding: 18px 20px; margin: 24px 0; }
        .job-title { font-size: 16px; font-weight: 700; color: #1a202c; margin: 0 0 4px; }
        .job-company { font-size: 13px; color: #718096; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
        .info-table td { padding: 8px 0; color: #4a5568; vertical-align: top; }
        .info-table td:first-child { font-weight: 600; color: #2d3748; width: 120px; }
        .status-badge { display: inline-block; padding: 6px 20px; border-radius: 4px; font-size: 13px; font-weight: 700; margin: 16px 0; letter-spacing: 0.5px; text-transform: uppercase; }
        .badge-dikirim   { background: #ebf8ff; color: #2b6cb0; border: 1px solid #bee3f8; }
        .badge-interview { background: #ebf8ff; color: #2c5282; border: 1px solid #90cdf4; }
        .badge-diterima  { background: #f0fff4; color: #276749; border: 1px solid #9ae6b4; }
        .badge-ditolak   { background: #fff5f5; color: #9b2c2c; border: 1px solid #feb2b2; }
        .highlight-box { background: #f0fff4; border: 1px solid #c6f6d5; padding: 18px 20px; margin: 20px 0; font-size: 14px; color: #276749; line-height: 1.8; }
        .info-box { background: #ebf8ff; border-left: 4px solid #3182ce; padding: 16px 18px; margin: 20px 0; font-size: 13px; color: #2a4365; line-height: 1.7; }
        .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
        .closing { font-size: 14px; color: #2d3748; margin-top: 28px; line-height: 1.8; }
        .closing strong { display: block; margin-top: 4px; }
        .footer { background: #f7fafc; padding: 20px 40px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header {{ $application->status }}">
            @if($application->status === 'dikirim')
                <h1>Lamaran Berhasil Terkirim</h1>
            @elseif($application->status === 'interview')
                <h1>Undangan Wawancara (Interview)</h1>
            @elseif($application->status === 'diterima')
                <h1>Pemberitahuan Penerimaan</h1>
            @elseif($application->status === 'ditolak')
                <h1>Pemberitahuan Status Lamaran</h1>
            @else
                <h1>Pembaruan Status Lamaran</h1>
            @endif
            <p>AlumniHub UHAMKA &mdash; Notifikasi Resmi</p>
        </div>
        <div class="body">
            <p class="salutation">Yth. Bapak/Ibu <strong>{{ $application->user->name }}</strong>,</p>

            @if($application->status === 'dikirim')
                {{-- ═══ LAMARAN TERKIRIM ═══ --}}
                <p class="content-text">Dengan hormat,</p>
                <p class="content-text">
                    Kami mengonfirmasikan bahwa lamaran Anda telah berhasil diterima dan tercatat dalam sistem kami untuk posisi berikut:
                </p>

                <div class="job-card">
                    <div class="job-title">{{ $job->title }}</div>
                    <div class="job-company">{{ $job->company }} &mdash; {{ $job->location }}</div>
                </div>

                <span class="status-badge badge-dikirim">Lamaran Terkirim</span>

                <p class="content-text">
                    Lamaran Anda saat ini sedang dalam tahap verifikasi administrasi. Anda dapat memantau perkembangan status lamaran melalui menu <strong>Lamaran Saya</strong> pada dashboard AlumniHub.
                </p>

                <p class="content-text">
                    Kami akan menginformasikan hasil seleksi melalui email dan notifikasi sistem dalam waktu yang telah ditentukan.
                </p>

            @elseif($application->status === 'interview')
                {{-- ═══ PANGGILAN INTERVIEW ═══ --}}
                <p class="content-text">
                    Terima kasih atas ketertarikan dan partisipasi Anda dalam proses rekrutmen di perusahaan kami.
                </p>
                <p class="content-text">
                    Berdasarkan hasil seleksi administrasi yang telah dilakukan, dengan ini kami mengundang Anda untuk mengikuti tahap <strong>wawancara (interview)</strong> dengan rincian sebagai berikut:
                </p>

                <div class="job-card">
                    <div class="job-title">{{ $job->title }}</div>
                    <div class="job-company">{{ $job->company }} &mdash; {{ $job->location }}</div>
                </div>

                <table class="info-table">
                    <tr><td>Posisi</td><td>: {{ $job->title }}</td></tr>
                    <tr><td>Perusahaan</td><td>: {{ $job->company }}</td></tr>
                    <tr><td>Lokasi</td><td>: {{ $job->location }}</td></tr>
                </table>

                <span class="status-badge badge-interview">Dipanggil Interview</span>

                <div class="info-box">
                    <strong>Langkah Selanjutnya:</strong><br>
                    Kami berharap kehadiran Anda tepat waktu sesuai jadwal yang akan ditentukan oleh pihak HRD perusahaan.
                    Apabila berhalangan hadir, mohon untuk memberikan konfirmasi kepada pihak HRD atau Kaprodi terlebih dahulu.
                    <br><br>
                    Informasi detail mengenai tanggal, waktu, dan lokasi wawancara akan disampaikan melalui kontak yang telah terdaftar.
                </div>

                <p class="content-text">
                    Demikian undangan ini kami sampaikan. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.
                </p>

            @elseif($application->status === 'diterima')
                {{-- ═══ DITERIMA ═══ --}}
                <p class="content-text">Dengan hormat,</p>
                <p class="content-text">
                    Setelah melalui rangkaian proses seleksi dan evaluasi, kami dengan senang hati memberitahukan bahwa Anda dinyatakan <strong>DITERIMA</strong> untuk bergabung bersama <strong>{{ $job->company }}</strong> pada posisi:
                </p>

                <div class="job-card">
                    <div class="job-title">{{ $job->title }}</div>
                    <div class="job-company">{{ $job->company }} &mdash; {{ $job->location }}</div>
                </div>

                <span class="status-badge badge-diterima">DITERIMA</span>

                <div class="highlight-box">
                    Kami menilai bahwa kualifikasi, kompetensi, serta pengalaman yang Anda miliki sesuai dengan kebutuhan perusahaan kami.
                </div>

                <p class="content-text">
                    Informasi lebih lanjut terkait jadwal <em>onboarding</em>, dokumen administrasi, dan ketentuan kerja akan kami sampaikan melalui email atau kontak resmi perusahaan dalam waktu dekat.
                </p>

                <p class="content-text">
                    <strong>Selamat atas pencapaian ini.</strong> Kami berharap Anda dapat memberikan kontribusi terbaik bersama tim kami.
                </p>

            @elseif($application->status === 'ditolak')
                {{-- ═══ DITOLAK ═══ --}}
                <p class="content-text">Dengan hormat,</p>
                <p class="content-text">
                    Terima kasih atas ketertarikan dan waktu yang telah Anda luangkan untuk mengikuti proses seleksi pada posisi berikut:
                </p>

                <div class="job-card">
                    <div class="job-title">{{ $job->title }}</div>
                    <div class="job-company">{{ $job->company }} &mdash; {{ $job->location }}</div>
                </div>

                <span class="status-badge badge-ditolak">Tidak Lolos Seleksi</span>

                <p class="content-text">
                    Setelah melalui pertimbangan yang matang, kami menyampaikan bahwa lamaran Anda belum dapat kami proses lebih lanjut untuk saat ini.
                    Keputusan ini tidak mengurangi penghargaan kami terhadap kualifikasi dan upaya yang telah Anda tunjukkan.
                </p>

                <p class="content-text">
                    Kami mendorong Anda untuk terus mengembangkan kompetensi dan tidak ragu untuk melamar kembali pada kesempatan lain yang sesuai melalui platform AlumniHub.
                </p>

            @else
                <div class="job-card">
                    <div class="job-title">{{ $job->title }}</div>
                    <div class="job-company">{{ $job->company }} &mdash; {{ $job->location }}</div>
                </div>
                <p class="content-text">
                    Status lamaran Anda saat ini sedang dalam proses peninjauan. Harap menunggu informasi selanjutnya.
                </p>
            @endif

            <hr class="divider">

            <div class="closing">
                Hormat kami,<br>
                <strong>Human Resource Department</strong>
                <span style="font-size: 13px; color: #718096;">{{ $job->company }}<br>Melalui AlumniHub UHAMKA</span>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} AlumniHub UHAMKA. Hak Cipta Dilindungi.<br>
            Email ini dikirim secara otomatis, mohon tidak membalas pesan ini.
        </div>
    </div>
</body>
</html>
