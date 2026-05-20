<?php

namespace App\Mail;

use App\Models\Application;
use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicationStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Application $application,
        public Job         $job
    ) {}

    public function envelope(): Envelope
    {
        $statusLabel = match ($this->application->status) {
            'dikirim'   => 'Konfirmasi Pengiriman',
            'interview' => 'Undangan Wawancara',
            'diterima'  => 'Pemberitahuan Penerimaan',
            'ditolak'   => 'Pemberitahuan Status',
            default     => 'Pembaruan Status',
        };

        return new Envelope(
            subject: "[AlumniHub] {$statusLabel} — Posisi \"{$this->job->title}\""
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.application-status',
        );
    }
}
