<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('jobs')->orderBy('name')->get();
        return response()->json(['success' => true, 'data' => $categories]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:100', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        $category = Category::create($data);
        return response()->json(['success' => true, 'message' => 'Kategori berhasil ditambahkan.', 'data' => $category], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Kategori tidak ditemukan.'], 404);
        }

        $data = $request->validate([
            'name'        => ['sometimes', 'string', 'max:100', 'unique:categories,name,' . $id],
            'description' => ['nullable', 'string'],
        ]);

        $category->update($data);
        return response()->json(['success' => true, 'message' => 'Kategori berhasil diperbarui.', 'data' => $category]);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Kategori tidak ditemukan.'], 404);
        }

        if ($category->jobs()->count() > 0) {
            return response()->json(['success' => false, 'message' => 'Kategori tidak bisa dihapus karena masih memiliki lowongan.'], 422);
        }

        $category->delete();
        return response()->json(['success' => true, 'message' => 'Kategori berhasil dihapus.']);
    }
}
