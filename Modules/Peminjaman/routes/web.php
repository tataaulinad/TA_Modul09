<?php

use Illuminate\Support\Facades\Route;
use Modules\Peminjaman\Http\Controllers\PeminjamanController;

Route::middleware(['auth', 'role:admin,user'])->group(function () {
    // Menampilkan halaman React
    Route::get('peminjaman', [PeminjamanController::class, 'index'])
        ->name('peminjaman.index');

    // Mengambil seluruh data
    Route::get('peminjaman/data', [PeminjamanController::class, 'getData'])
        ->name('peminjaman.data');

    // Menambahkan data
    Route::post('peminjaman', [PeminjamanController::class, 'store'])
        ->name('peminjaman.store');

    // Mengambil data untuk edit
    Route::get('peminjaman/{peminjaman}/edit', [PeminjamanController::class, 'edit'])
        ->name('peminjaman.edit');

    // Memperbarui data
    Route::put('peminjaman/{peminjaman}', [PeminjamanController::class, 'update'])
        ->name('peminjaman.update');

    // Menghapus data
    Route::delete('peminjaman/{peminjaman}', [PeminjamanController::class, 'destroy'])
        ->name('peminjaman.destroy');
});
