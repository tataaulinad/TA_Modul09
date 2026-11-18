<?php

namespace Modules\Peminjaman\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Peminjaman\Http\Requests\PeminjamanRequest;
use Modules\Peminjaman\Models\Peminjaman;

class PeminjamanController extends Controller
{
    /**
     * Menampilkan halaman React.
     */
    public function index(): Response
    {
        return Inertia::render('Peminjaman::index');
    }

    /**
     * Mengambil seluruh data peminjaman dalam JSON.
     */
    public function getData(): JsonResponse
    {
        return response()->json(
            Peminjaman::latest()->get()
        );
    }

    /**
     * Menyimpan data peminjaman dan file bukti.
     */
    public function store(PeminjamanRequest $request): JsonResponse
    {
        $data = $request->safe()->except('bukti');

        $file = $request->file('bukti');

        $data['bukti'] = $file->store('bukti_peminjaman', 'public');
        $data['nama_bukti'] = $file->getClientOriginalName();

        Peminjaman::create($data);

        return response()->json([
            'success' => 'Data peminjaman berhasil disimpan.',
        ]);
    }

    /**
     * Mengambil satu data untuk kebutuhan edit.
     */
    public function edit(Peminjaman $peminjaman): JsonResponse
    {
        return response()->json($peminjaman);
    }

    /**
     * Memperbarui data dan mengganti file jika ada file baru.
     */
    public function update(
        PeminjamanRequest $request,
        Peminjaman $peminjaman
    ): JsonResponse {
        $data = $request->safe()->except('bukti');

        if ($request->hasFile('bukti')) {
            if ($peminjaman->bukti) {
                Storage::disk('public')->delete($peminjaman->bukti);
            }

            $file = $request->file('bukti');

            $data['bukti'] = $file->store('bukti_peminjaman', 'public');
            $data['nama_bukti'] = $file->getClientOriginalName();
        }

        $peminjaman->update($data);

        return response()->json([
            'success' => 'Data peminjaman berhasil diperbarui.',
        ]);
    }

    /**
     * Menghapus data dan file bukti.
     */
    public function destroy(Peminjaman $peminjaman): JsonResponse
    {
        if ($peminjaman->bukti) {
            Storage::disk('public')->delete($peminjaman->bukti);
        }

        $peminjaman->delete();

        return response()->json([
            'success' => 'Data peminjaman berhasil dihapus.',
        ]);
    }
}
