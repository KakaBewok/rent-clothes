import { Branch, Filter } from '@/types/models';
import { useState } from 'react';

interface ScheduleModalProps {
    isUnclose: boolean;
    onClose: () => void;
    filter: Filter;
    branchs: Branch[];
}

const ScheduleModal = ({ isUnclose, onClose, filter, branchs }: ScheduleModalProps) => {
    const [form, setForm] = useState<Filter>(filter);

    function getTodayDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0]; // format YYYY-MM-DD
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // router.get('/', form, {
        //     preserveScroll: true,
        //     preserveState: true,
        // });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50" onClick={() => !isUnclose && onClose()}>
            <div
                className="relative z-50 w-full max-w-md bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()} // biar klik konten tidak close
            >
                {/* header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Cek Jadwal</h2>
                    {!isUnclose && (
                        <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            ✕
                        </button>
                    )}
                </div>

                {/* form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal Pakai</label>
                        <input
                            type="date"
                            name="useByDate"
                            value={form.useByDate}
                            onChange={handleChange}
                            min={getTodayDate()}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-first focus:ring-first"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Durasi Pakai (Hari)</label>
                        <div className="mt-1 flex items-center justify-start rounded-md border border-gray-300 text-black shadow-sm">
                            {/* Tombol minus */}
                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        duration: Math.max(1, Number(form.duration) - 1),
                                    })
                                }
                                className="bg-gray-400 px-3 py-2 text-gray-100"
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
                                className="w-full px-2 text-sm focus:border-gray-300 focus:ring-0 focus:outline-none"
                            />

                            {/* Tombol plus */}
                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        duration: Number(form.duration) + 1,
                                    })
                                }
                                className="bg-gray-500 px-3 py-2 text-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Durasi Pakai (Hari)</label>
                        <input
                            type="number"
                            min="1"
                            name="duration"
                            value={form.duration}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-first focus:ring-first"
                        />
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pilih Tipe Pengiriman</label>
                        <select
                            name="shippingType"
                            value={form.shippingType}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-first focus:ring-first"
                        >
                            <option value="">-- Pilih --</option>
                            <option value="Next day">Next Day</option>
                            <option value="Same day">Same Day</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pilih Asal Pengiriman</label>
                        <select
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-first focus:ring-first"
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

                    <button type="submit" className="w-full rounded-md bg-first py-2 font-medium text-white shadow hover:bg-first/90">
                        Cari
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
