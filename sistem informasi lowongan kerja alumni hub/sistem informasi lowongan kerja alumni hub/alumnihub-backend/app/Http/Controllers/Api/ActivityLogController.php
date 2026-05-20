<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource (Kaprodi Only)
     */
    public function index()
    {
        $logs = ActivityLog::with('user:id,name,role')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $logs
        ]);
    }
}
