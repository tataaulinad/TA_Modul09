import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        penulis: '',
        penerbit: '',
        tahun_terbit: new Date().getFullYear().toString(),
        stok: '0',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/buku');
    }

    return (
        <>
            <Head title="Tambah Buku" />

            <div className="max-w-2xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Tambah Buku</h1>
                    <p className="text-sm text-muted-foreground">
                        Masukkan informasi buku baru.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Judul Buku
                        </label>
                        <input
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {errors.judul && (
                            <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Penulis
                        </label>
                        <input
                            type="text"
                            value={data.penulis}
                            onChange={(e) => setData('penulis', e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {errors.penulis && (
                            <p className="mt-1 text-sm text-red-600">{errors.penulis}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Penerbit
                        </label>
                        <input
                            type="text"
                            value={data.penerbit}
                            onChange={(e) => setData('penerbit', e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {errors.penerbit && (
                            <p className="mt-1 text-sm text-red-600">{errors.penerbit}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Tahun Terbit
                        </label>
                        <input
                            type="number"
                            value={data.tahun_terbit}
                            onChange={(e) => setData('tahun_terbit', e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {errors.tahun_terbit && (
                            <p className="mt-1 text-sm text-red-600">{errors.tahun_terbit}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Stok
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.stok}
                            onChange={(e) => setData('stok', e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {errors.stok && (
                            <p className="mt-1 text-sm text-red-600">{errors.stok}</p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>

                        <Link
                            href="/buku"
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
