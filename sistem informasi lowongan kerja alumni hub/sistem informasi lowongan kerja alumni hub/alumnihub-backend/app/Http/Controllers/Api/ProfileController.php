<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use App\Models\UserLanguage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    // GET /api/profile
    public function index(Request $request)
    {
        $user = $request->user()->load(['documents', 'languages']);
        return response()->json([
            'success' => true,
            'data'    => $user,
        ]);
    }

    // POST /api/profile/biodata
    public function updateBiodata(Request $request)
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'name'             => 'required|string|max:100',
            'gender'           => 'nullable|in:Laki-laki,Perempuan',
            'phone'            => 'nullable|string|max:20',
            'address'          => 'nullable|string',
            'domicile_address' => 'nullable|string',
            'fakultas'         => 'nullable|string|max:100',
            'jurusan'          => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user->update($request->only(['name', 'gender', 'phone', 'address', 'domicile_address', 'fakultas', 'jurusan']));

        return response()->json([
            'success' => true,
            'message' => 'Biodata berhasil diperbarui.',
            'data'    => $user,
        ]);
    }

    // POST /api/profile/avatar
    public function uploadAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'File tidak valid.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars/' . $user->id, 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Foto profil berhasil diunggah.',
            'data'    => ['avatar' => $path],
        ]);
    }

    // POST /api/profile/documents
    public function addDocument(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type'        => 'required|in:pendidikan,pelatihan,sertifikasi,pengalaman,keterampilan,pencapaian,cv',
            'description' => 'required|string',
            'file'        => 'required|file|mimes:pdf|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $file = $request->file('file');
        
        // Simpan file
        $path = $file->store('documents/' . $user->id, 'public');

        // Jika tipe CV, hapus CV lama agar cuma ada 1
        if ($request->type === 'cv') {
            $oldCv = $user->documents()->where('type', 'cv')->first();
            if ($oldCv) {
                if ($oldCv->file_path && Storage::disk('public')->exists($oldCv->file_path)) {
                    Storage::disk('public')->delete($oldCv->file_path);
                }
                $oldCv->delete();
            }
        }

        $document = $user->documents()->create([
            'type'        => $request->type,
            'description' => $request->description,
            'file_path'   => $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil ditambahkan.',
            'data'    => $document,
        ]);
    }

    // DELETE /api/profile/documents/{id}
    public function deleteDocument(Request $request, $id)
    {
        $document = $request->user()->documents()->find($id);

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen tidak ditemukan.',
            ], 404);
        }

        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil dihapus.',
        ]);
    }

    // POST /api/profile/languages
    public function addLanguage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'language' => 'required|string|max:100',
            'score'    => 'required|integer|min:0',
            'file'     => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $path = null;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('languages/' . $user->id, 'public');
        }

        $language = $user->languages()->create([
            'language'  => $request->language,
            'score'     => $request->score,
            'file_path' => $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bahasa berhasil ditambahkan.',
            'data'    => $language,
        ]);
    }

    // DELETE /api/profile/languages/{id}
    public function deleteLanguage(Request $request, $id)
    {
        $language = $request->user()->languages()->find($id);

        if (!$language) {
            return response()->json([
                'success' => false,
                'message' => 'Bahasa tidak ditemukan.',
            ], 404);
        }

        if ($language->file_path && Storage::disk('public')->exists($language->file_path)) {
            Storage::disk('public')->delete($language->file_path);
        }

        $language->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bahasa berhasil dihapus.',
        ]);
    }
}
