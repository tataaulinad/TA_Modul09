import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useSharedProps } from '@/hooks/use-shared-props';

type Buku = {
    id: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    stok: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    bukus: {
        data: Buku[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search: string;
    };
    canManage: boolean;
};

export default function Index({ bukus, filters, canManage }: Props) {
    const { flash } = useSharedProps();
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        router.get('/buku', { search }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleDelete(id: number) {
        if (window.confirm('Yakin ingin menghapus buku ini?')) {
            router.delete(`/buku/${id}`);
        }
    }

    return (
        <>
            <Head title="Data Buku" />

            <div className="space-y-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Data Buku</h1>
                        <p className="text-sm text-muted-foreground">
                            Daftar koleksi buku perpustakaan.
                        </p>
                    </div>

                    {canManage && (
                        <Link
                            href="/buku/create"
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        >
                            + Tambah Buku
                        </Link>
                    )}
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari judul, penulis, atau penerbit..."
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                        Cari
                    </button>
                </form>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3">No.</th>
                                <th className="p-3">Judul</th>
                                <th className="p-3">Penulis</th>
                                <th className="p-3">Penerbit</th>
                                <th className="p-3">Tahun</th>
                                <th className="p-3">Stok</th>
                                {canManage && <th className="p-3">Aksi</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {bukus.data.length > 0 ? (
                                bukus.data.map((buku, index) => (
                                    <tr key={buku.id} className="border-t">
                                        <td className="p-3">
                                            {(bukus.current_page - 1) * 10 + index + 1}
                                        </td>
                                        <td className="p-3">{buku.judul}</td>
                                        <td className="p-3">{buku.penulis}</td>
                                        <td className="p-3">{buku.penerbit}</td>
                                        <td className="p-3">{buku.tahun_terbit}</td>
                                        <td className="p-3">{buku.stok}</td>

                                        {canManage && (
                                            <td className="space-x-3 whitespace-nowrap p-3">
                                                <Link
                                                    href={`/buku/${buku.id}/edit`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(buku.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={canManage ? 7 : 6}
                                        className="p-6 text-center text-muted-foreground"
                                    >
                                        Data buku tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                        Total {bukus.total} buku
                    </p>

                    <div className="flex flex-wrap gap-1">
                        {bukus.links.map((link, index) => (
                            <button
                                key={index}
                                type="button"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={`rounded border px-3 py-1 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-background'
                                } disabled:opacity-40`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
