<?php

namespace App\Mail;

use App\Models\Job;
use App\Models\JobReview;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Job       $job,
        public JobReview $review
    ) {}

    public function envelope(): Envelope
    {
        $statusLabel = match ($this->review->status) {
            'approve'  => 'Disetujui',
            'rejected' => 'Ditolak',
            'revision' => 'Perlu Revisi',
            default    => 'Diperbarui',
        };

        return new Envelope(
            subject: "[AlumniHub] Status Lowongan \"{$this->job->title}\" — {$statusLabel}"
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.job-status',
        );
    }
}
