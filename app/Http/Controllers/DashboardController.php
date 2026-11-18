<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Modules\Buku\Models\Buku;
use Modules\Peminjaman\Models\Peminjaman;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $isAdmin = $request->user()->isAdmin();

        return Inertia::render('dashboard', [
            'totalBuku' => Buku::count(),

            'totalPeminjaman' => Peminjaman::count(),

            'totalUsers' => $isAdmin
                ? User::count()
                : null,

            'peminjamanTerbaru' => Peminjaman::latest()
                ->take(5)
                ->get([
                    'id',
                    'nama_peminjam',
                    'judul_buku',
                    'tanggal_pinjam',
                    'status',
                ]),
        ]);
    }
}
