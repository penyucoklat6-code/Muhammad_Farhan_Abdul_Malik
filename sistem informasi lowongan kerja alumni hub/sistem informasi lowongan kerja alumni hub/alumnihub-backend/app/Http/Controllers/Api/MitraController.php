<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mitra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MitraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Use pagination if there are more than 20 records
        $perPage = $request->get('per_page', 20);
        $mitras = Mitra::orderBy('name')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $mitras
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:255|unique:mitras,name',
            'description'      => 'nullable|string',
            'logo'             => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'established_date' => 'nullable|date',
            'address'          => 'nullable|string',
            'website_url'      => 'nullable|url|max:255',
        ]);

        $data = $request->only(['name', 'description', 'established_date', 'address', 'website_url']);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('mitras', 'public');
            $data['logo'] = $path;
        }

        $mitra = Mitra::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Mitra perusahaan berhasil ditambahkan',
            'data' => $mitra
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mitra = Mitra::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $mitra
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $mitra = Mitra::findOrFail($id);

        $request->validate([
            'name'             => 'required|string|max:255|unique:mitras,name,' . $mitra->id,
            'description'      => 'nullable|string',
            'logo'             => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'established_date' => 'nullable|date',
            'address'          => 'nullable|string',
            'website_url'      => 'nullable|url|max:255',
        ]);

        $data = $request->only(['name', 'description', 'established_date', 'address', 'website_url']);

        if ($request->hasFile('logo')) {
            if ($mitra->logo) {
                Storage::disk('public')->delete($mitra->logo);
            }
            $path = $request->file('logo')->store('mitras', 'public');
            $data['logo'] = $path;
        }

        $mitra->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Mitra perusahaan berhasil diupdate',
            'data' => $mitra
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mitra = Mitra::findOrFail($id);

        if ($mitra->logo) {
            Storage::disk('public')->delete($mitra->logo);
        }

        $mitra->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mitra perusahaan berhasil dihapus'
        ]);
    }
}
