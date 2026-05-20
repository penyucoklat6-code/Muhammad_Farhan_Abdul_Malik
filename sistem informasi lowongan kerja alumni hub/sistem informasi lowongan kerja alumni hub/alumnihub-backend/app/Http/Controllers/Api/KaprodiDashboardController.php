<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KaprodiDashboardController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $pendingJobsCount = Job::where('status', 'pending')->count();
        $activeJobsCount = Job::where('status', 'published')->count();
        $totalApplicantsCount = Application::count();

        // Data for List
        $publishedJobs = Job::where('status', 'published')
            ->withCount('applications')
            ->with(['applications' => function ($query) {
                $query->select('id', 'job_id', 'status');
            }])
            ->orderBy('applications_count', 'desc')
            ->get(['id', 'title', 'company', 'logo']);

        // Tambahkan perhitungan status per job
        $publishedJobs = $publishedJobs->map(function ($job) {
            $statusCounts = [
                'dikirim' => 0,
                'interview' => 0,
                'diterima' => 0,
                'ditolak' => 0,
            ];

            foreach ($job->applications as $app) {
                if (isset($statusCounts[$app->status])) {
                    $statusCounts[$app->status]++;
                }
            }

            $job->status_counts = $statusCounts;
            unset($job->applications); // remove raw applications data from response
            return $job;
        });

        // Format for Global Chart 1 (Applicants per Job)
        $chartApplicantsPerJob = $publishedJobs->filter(function($job) {
            return $job->applications_count > 0;
        })->map(function($job) {
            return [
                'name' => $job->title,
                'value' => $job->applications_count
            ];
        })->values();

        // Data for Global Chart 2: Status Pelamar (Diterima vs Ditolak vs dsb)
        $statusCounts = Application::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        $chartApplicationStatus = $statusCounts->map(function($item) {
            return [
                'name' => ucfirst($item->status),
                'value' => $item->count
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'pending_jobs' => $pendingJobsCount,
                    'active_jobs' => $activeJobsCount,
                    'total_applicants' => $totalApplicantsCount,
                ],
                'published_jobs' => $publishedJobs,
                'charts' => [
                    'applicants_per_job' => $chartApplicantsPerJob,
                    'application_status' => $chartApplicationStatus,
                ]
            ]
        ]);
    }
}
