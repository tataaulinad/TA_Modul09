import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    BookOpen,
    ClipboardList,
    Users,
    ArrowRight,
    Library,
} from 'lucide-react';

type Peminjaman = {
    id: number;
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    status: string;
};

type Props = {
    totalBuku: number;
    totalPeminjaman: number;
    totalUsers: number | null;
    peminjamanTerbaru: Peminjaman[];
};

export default function Dashboard({
    totalBuku,
    totalPeminjaman,
    totalUsers,
    peminjamanTerbaru,
}: Props) {
    const statistics = [
        {
            title: 'Total Buku',
            value: totalBuku,
            description: 'Koleksi buku perpustakaan',
            icon: BookOpen,
            color: 'text-blue-600',
            background: 'bg-blue-100',
        },
        {
            title: 'Total Peminjaman',
            value: totalPeminjaman,
            description: 'Seluruh transaksi peminjaman',
            icon: ClipboardList,
            color: 'text-green-600',
            background: 'bg-green-100',
        },
        ...(totalUsers !== null
            ? [{
                title: 'Total Pengguna',
                value: totalUsers,
                description: 'Akun terdaftar',
                icon: Users,
                color: 'text-purple-600',
                background: 'bg-purple-100',
            }]
            : []),
    ];

    return (
        <>
            <Head title="Dashboard SiPustaka" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2">
                        <Library className="size-7 text-primary" />
                        <h1 className="text-2xl font-bold">
                            Dashboard SiPustaka
                        </h1>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Selamat datang di Sistem Informasi Perpustakaan.
                        Kelola koleksi buku dan peminjaman dengan mudah.
                    </p>
                </div>

                {/* Statistik */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statistics.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-xl border bg-card p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {item.title}
                                        </p>
                                        <h2 className="mt-2 text-3xl font-bold">
                                            {item.value}
                                        </h2>
                                    </div>

                                    <div className={`rounded-xl p-3 ${item.background}`}>
                                        <Icon className={`size-6 ${item.color}`} />
                                    </div>
                                </div>

                                <p className="mt-3 text-xs text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Aktivitas peminjaman */}
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
                        <div>
                            <h2 className="font-semibold">
                                Peminjaman Terbaru
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Lima transaksi peminjaman terakhir.
                            </p>
                        </div>

                        <Link
                            href="/peminjaman"
                            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                            Lihat Semua
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-5 py-3">No.</th>
                                    <th className="px-5 py-3">Peminjam</th>
                                    <th className="px-5 py-3">Judul Buku</th>
                                    <th className="px-5 py-3">Tanggal Pinjam</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {peminjamanTerbaru.length > 0 ? (
                                    peminjamanTerbaru.map((item, index) => (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-5 py-4">
                                                {index + 1}
                                            </td>
                                            <td className="px-5 py-4 font-medium">
                                                {item.nama_peminjam}
                                            </td>
                                            <td className="px-5 py-4">
                                                {item.judul_buku}
                                            </td>
                                            <td className="px-5 py-4">
                                                {item.tanggal_pinjam}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    item.status === 'Dipinjam'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-10 text-center text-muted-foreground"
                                        >
                                            <ClipboardList className="mx-auto mb-2 size-8 opacity-40" />
                                            Belum ada aktivitas peminjaman.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Informasi */}
                <div className="rounded-xl border bg-muted/30 p-5">
                    <h3 className="font-semibold">
                        Informasi SiPustaka
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        SiPustaka merupakan sistem informasi perpustakaan
                        untuk mengelola koleksi buku, transaksi peminjaman,
                        dan data pengguna secara terintegrasi.
                    </p>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
