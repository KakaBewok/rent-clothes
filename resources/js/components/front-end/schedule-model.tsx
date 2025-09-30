import { Branch, Filter } from '@/types/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface ScheduleModalProps {
    isUnclose: boolean;
    onClose: () => void;
    filter: Filter;
    branchs: Branch[];
}

const ScheduleModal = ({ isUnclose, onClose, filter, branchs }: ScheduleModalProps) => {
    const [form, setForm] = useState<Filter>({
        ...filter,
        useByDate: normalizeDate(filter.useByDate),
    });

    function getTodayDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    function normalizeDate(dateStr: string): string {
        if (!dateStr) return '';

        const parts = dateStr.split('-');
        if (parts.length !== 3) return '';

        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
    }

    function toDDMMYYYY(dateStr: string): string {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return '';
        const [year, month, day] = parts;
        return `${day}-${month}-${year}`;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.get(
            '/',
            { ...form, useByDate: toDDMMYYYY(form.useByDate) },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );

        onClose();
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50" onClick={() => !isUnclose && onClose()}>
            <div className="relative z-50 mx-2 w-full max-w-md bg-white p-5 shadow-sm md:mx-0" onClick={(e) => e.stopPropagation()}>
                {/* header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">Cek Jadwal</h2>
                    {!isUnclose && (
                        <button type="button" onClick={onClose} className="cursor-pointer p-1.5 text-slate-700 hover:text-slate-800">
                            ✕
                        </button>
                    )}
                </div>

                <hr className="mt-2 mb-6 border-[0.5px] border-slate-100" />

                {/* form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Tanggal Pakai</label>
                        <input
                            type="date"
                            name="useByDate"
                            value={form.useByDate}
                            onChange={handleChange}
                            min={getTodayDate()}
                            className="mt-1 w-full cursor-pointer border border-slate-300 px-3 py-2 text-sm text-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Durasi Pakai (Hari)</label>
                        <div className="mt-1 flex items-center justify-start border border-slate-300 text-slate-700">
                            {/* minus */}
                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        duration: Math.max(1, Number(form.duration) - 1),
                                    })
                                }
                                className="cursor-pointer bg-slate-800 px-3 py-2 text-white"
                            >
                                -
                            </button>

                            {/* Input number */}
                            <input
                                type="number"
                                min="1"
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm focus:ring-0 focus:outline-none"
                            />

                            {/* plus */}
                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        duration: Number(form.duration) + 1,
                                    })
                                }
                                className="cursor-pointer bg-slate-800 px-3 py-2 text-white"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Tipe Pengiriman</label>
                        <select
                            name="shippingType"
                            value={form.shippingType}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm text-slate-700"
                        >
                            <option value="">-- Pilih --</option>
                            <option value="Next day">Next Day</option>
                            <option value="Same day">Same Day</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Asal Pengiriman</label>
                        <select
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm text-slate-700"
                        >
                            <option value="">-- Pilih --</option>
                            {branchs &&
                                branchs.length > 0 &&
                                branchs.map((branch) => (
                                    <option key={branch.id} value={`${branch.id}`}>
                                        {branch.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <button type="submit" className="w-full cursor-pointer bg-slate-700 py-2 font-medium text-white">
                        Cari
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
