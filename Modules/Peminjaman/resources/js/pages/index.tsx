import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { http, HttpError } from '@/lib/http';
import type { ValidationErrors } from '@/lib/http';

type Peminjaman = {
    id: number;
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    status: string;
    bukti: string | null;
    nama_bukti: string | null;
    bukti_url: string | null;
};

type FormFields = {
    nama_peminjam: string;
    judul_buku: string;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    status: string;
};

type Message = {
    type: 'success' | 'error';
    text: string;
} | null;

const emptyForm: FormFields = {
    nama_peminjam: '',
    judul_buku: '',
    tanggal_pinjam: '',
    tanggal_kembali: '',
    status: 'Dipinjam',
};

const urls = {
    data: '/peminjaman/data',
    store: '/peminjaman',
    edit: (id: number) => `/peminjaman/${id}/edit`,
    update: (id: number) => `/peminjaman/${id}`,
    destroy: (id: number) => `/peminjaman/${id}`,
};

export default function Index() {
    const [records, setRecords] = useState<Peminjaman[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [message, setMessage] = useState<Message>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Peminjaman | null>(null);
    const [form, setForm] = useState<FormFields>(emptyForm);
    const [file, setFile] = useState<File | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [saving, setSaving] = useState(false);

    const showError = (error: unknown, fallback: string) => {
        const text = error instanceof HttpError
            ? (error.data?.message ?? fallback)
            : fallback;

        setMessage({ type: 'error', text });
    };

    // Mengambil data dari Laravel melalui AJAX
    const loadData = async () => {
        setLoading(true);

        try {
            setRecords(await http<Peminjaman[]>(urls.data));
        } catch (error) {
            showError(error, 'Gagal memuat data peminjaman.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Pencarian data di browser
    const filtered = useMemo(() => {
        const q = keyword.trim().toLowerCase();

        if (q === '') return records;

        return records.filter((item) =>
            [
                item.nama_peminjam,
                item.judul_buku,
                item.status,
            ].some((value) => value.toLowerCase().includes(q)),
        );
    }, [records, keyword]);

    const resetForm = () => {
        setForm(emptyForm);
        setFile(null);
        setFileInputKey((key) => key + 1);
        setErrors({});
    };

    // Membuka dialog tambah
    const openCreate = () => {
        setEditing(null);
        resetForm();
        setDialogOpen(true);
    };

    // Mengambil data untuk diedit
    const openEdit = async (id: number) => {
        try {
            const data = await http<Peminjaman>(urls.edit(id));

            setEditing(data);
            setForm({
                nama_peminjam: data.nama_peminjam,
                judul_buku: data.judul_buku,
                tanggal_pinjam: data.tanggal_pinjam,
                tanggal_kembali: data.tanggal_kembali,
                status: data.status,
            });

            setFile(null);
            setFileInputKey((key) => key + 1);
            setErrors({});
            setDialogOpen(true);
        } catch (error) {
            showError(error, 'Data peminjaman tidak ditemukan.');
        }
    };

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    // Menyimpan data dengan FormData
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setSaving(true);
        setErrors({});

        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (file) {
            formData.append('bukti', file);
        }

        if (editing) {
            formData.append('_method', 'PUT');
        }

        try {
            const result = await http<{ success: string }>(
                editing ? urls.update(editing.id) : urls.store,
                {
                    method: 'POST',
                    body: formData,
                },
            );

            setDialogOpen(false);
            setMessage({ type: 'success', text: result.success });

            await loadData();
        } catch (error) {
            if (error instanceof HttpError && error.status === 422) {
                setErrors(error.data?.errors ?? {});
            } else {
                showError(error, 'Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setSaving(false);
        }
    };

    // Menghapus data
    const handleDelete = async (item: Peminjaman) => {
        if (!window.confirm(
            `Yakin ingin menghapus peminjaman ${item.nama_peminjam}?`,
        )) {
            return;
        }

        try {
            const result = await http<{ success: string }>(
                urls.destroy(item.id),
                { method: 'DELETE' },
            );

            setMessage({ type: 'success', text: result.success });
            await loadData();
        } catch (error) {
            showError(error, 'Data gagal dihapus.');
        }
    };

    return (
        <>
            <Head title="Data Peminjaman" />

            <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Data Peminjaman
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data peminjaman buku perpustakaan.
                        </p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                    >
                        + Tambah Peminjaman
                    </button>
                </div>

                {message && (
                    <div className={`rounded-md p-3 text-sm ${
                        message.type === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {message.text}
                        <button
                            onClick={() => setMessage(null)}
                            className="float-right"
                        >
                            ×
                        </button>
                    </div>
                )}

                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Cari nama peminjam, judul buku, atau status..."
                    className="w-full max-w-md rounded-md border px-3 py-2 text-sm"
                />

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3">No.</th>
                                <th className="p-3">Nama Peminjam</th>
                                <th className="p-3">Judul Buku</th>
                                <th className="p-3">Tanggal Pinjam</th>
                                <th className="p-3">Tanggal Kembali</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Bukti</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={8} className="p-6 text-center">
                                        Memuat data...
                                    </td>
                                </tr>
                            )}

                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-6 text-center">
                                        Belum ada data peminjaman.
                                    </td>
                                </tr>
                            )}

                            {!loading && filtered.map((item, index) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{item.nama_peminjam}</td>
                                    <td className="p-3">{item.judul_buku}</td>
                                    <td className="p-3">{item.tanggal_pinjam}</td>
                                    <td className="p-3">{item.tanggal_kembali}</td>
                                    <td className="p-3">
                                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {item.bukti_url ? (
                                            <a
                                                href={item.bukti_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                {item.nama_bukti ?? 'Lihat Bukti'}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(item.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="text-sm text-muted-foreground">
                    Total {filtered.length} data peminjaman.
                </p>

                {/* Dialog tambah dan edit */}
                {dialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">
                            <h2 className="mb-5 text-xl font-bold">
                                {editing ? 'Edit Peminjaman' : 'Tambah Peminjaman'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nama Peminjam
                                    </label>
                                    <input
                                        name="nama_peminjam"
                                        value={form.nama_peminjam}
                                        onChange={handleChange}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                    <p className="text-sm text-red-600">
                                        {errors.nama_peminjam?.[0]}
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Judul Buku
                                    </label>
                                    <input
                                        name="judul_buku"
                                        value={form.judul_buku}
                                        onChange={handleChange}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                    <p className="text-sm text-red-600">
                                        {errors.judul_buku?.[0]}
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Tanggal Pinjam
                                    </label>
                                    <input
                                        type="date"
                                        name="tanggal_pinjam"
                                        value={form.tanggal_pinjam}
                                        onChange={handleChange}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                    <p className="text-sm text-red-600">
                                        {errors.tanggal_pinjam?.[0]}
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Tanggal Kembali
                                    </label>
                                    <input
                                        type="date"
                                        name="tanggal_kembali"
                                        value={form.tanggal_kembali}
                                        onChange={handleChange}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                    <p className="text-sm text-red-600">
                                        {errors.tanggal_kembali?.[0]}
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full rounded-md border px-3 py-2"
                                    >
                                        <option value="Dipinjam">Dipinjam</option>
                                        <option value="Dikembalikan">Dikembalikan</option>
                                    </select>
                                    <p className="text-sm text-red-600">
                                        {errors.status?.[0]}
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Bukti Peminjaman
                                    </label>
                                    <input
                                        key={fileInputKey}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                        className="w-full rounded-md border p-2 text-sm"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Format JPG, JPEG, PNG, atau PDF. Maksimal 2 MB.
                                        {editing && ' Kosongkan jika tidak ingin mengganti bukti.'}
                                    </p>
                                    <p className="text-sm text-red-600">
                                        {errors.bukti?.[0]}
                                    </p>

                                    {editing?.bukti_url && (
                                        <p className="mt-2 text-sm">
                                            Bukti saat ini:{' '}
                                            <a
                                                href={editing.bukti_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                {editing.nama_bukti}
                                            </a>
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setDialogOpen(false)}
                                        disabled={saving}
                                        className="rounded-md border px-4 py-2 text-sm"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                                    >
                                        {saving ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
