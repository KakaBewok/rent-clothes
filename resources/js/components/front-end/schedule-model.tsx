// import { useForm } from '@inertiajs/react';

// interface ScheduleModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     initialValues: {
//         useByDate: string;
//         duration: string | number;
//         city: string;
//         shippingType: string;
//     };
// }

// export default function ScheduleModal({ isOpen, onClose, initialValues }: ScheduleModalProps) {
//     const { data, setData, post, processing } = useForm({
//         useByDate: initialValues.useByDate,
//         duration: initialValues.duration,
//         city: initialValues.city,
//         shippingType: initialValues.shippingType,
//     });

//     if (!isOpen) return null;

//     const handleSubmit = (e) => {
//         // e.preventDefault();
//         // post(route('check.jadwal'), {
//         //     onSuccess: () => onClose(),
//         // });

//         alert(`Form submitted`);
//     };

//     return (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black opacity-10">
//             <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
//                 <h2 className="mb-4 text-xl font-bold">Check Jadwal</h2>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium">Tanggal Pakai</label>
//                         <input
//                             type="date"
//                             value={data.useByDate}
//                             onChange={(e) => setData('useByDate', e.target.value)}
//                             className="w-full rounded border px-2 py-1"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium">Durasi Pakai (Hari)</label>
//                         <input
//                             type="number"
//                             min="1"
//                             value={data.duration}
//                             onChange={(e) => setData('duration', e.target.value)}
//                             className="w-full rounded border px-2 py-1"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium">Pilih tipe pengiriman</label>
//                         <select
//                             value={data.shippingType}
//                             onChange={(e) => setData('shippingType', e.target.value)}
//                             className="w-full rounded border px-2 py-1"
//                         >
//                             <option value="">-- pilih --</option>
//                             <option value="nd">Next Day</option>
//                             <option value="reg">Reguler</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium">Pilih asal pengiriman</label>
//                         <select value={data.city} onChange={(e) => setData('city', e.target.value)} className="w-full rounded border px-2 py-1">
//                             <option value="">-- pilih --</option>
//                             <option value="9a9a6938-1024-4714-bfbc-e8597a4488bb">Tangerang Selatan</option>
//                             <option value="another-id">Jakarta</option>
//                         </select>
//                     </div>

//                     <button type="submit" disabled={processing} className="bg-beige-600 w-full rounded py-2 text-white">
//                         Cari
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }
