<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Major;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MajorController extends Controller
{
    public function index(): JsonResponse
    {
        $majors = Major::withCount('jobs')->orderBy('name')->get();
        return response()->json(['success' => true, 'data' => $majors]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:majors,name'],
        ]);

        $major = Major::create($data);
        return response()->json(['success' => true, 'message' => 'Jurusan berhasil ditambahkan.', 'data' => $major], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $major = Major::find($id);
        if (!$major) {
            return response()->json(['success' => false, 'message' => 'Jurusan tidak ditemukan.'], 404);
        }

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100', 'unique:majors,name,' . $id],
        ]);

        $major->update($data);
        return response()->json(['success' => true, 'message' => 'Jurusan berhasil diperbarui.', 'data' => $major]);
    }

    public function destroy(int $id): JsonResponse
    {
        $major = Major::find($id);
        if (!$major) {
            return response()->json(['success' => false, 'message' => 'Jurusan tidak ditemukan.'], 404);
        }

        if ($major->jobs()->count() > 0) {
            return response()->json(['success' => false, 'message' => 'Jurusan tidak bisa dihapus karena masih terkait dengan lowongan.'], 422);
        }

        $major->delete();
        return response()->json(['success' => true, 'message' => 'Jurusan berhasil dihapus.']);
    }
}
