// import { Branch } from '@/types/models';
// import { useState } from 'react';

// export default function Schedule({ branches }: { branches: Branch[] }) {
//     const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
//     const [durasi, setDurasi] = useState(1);
//     const [tipePengiriman, setTipePengiriman] = useState('nd');
//     const [branch, setBranch] = useState(branches.length > 0 ? branches[0].id : '');

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const formData = {
//             searchTanggal: tanggal,
//             searchDurasi: durasi,
//             searchKota: branch,
//             tipePengiriman: tipePengiriman,
//         };

//         console.log('Form submitted:', formData);
//         alert('Form submitted! Check console for data.');

//         // Replace this with your actual form submission logic
//         // post(route('cek-jadwal.submit'), { data: formData });
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
//             <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
//                 <h2 className="mb-6 text-center text-xl font-bold text-gray-800">Cek Jadwal Penyewaan</h2>

//                 <div className="space-y-4">
//                     {/* Tanggal pakai */}
//                     <div>
//                         <label htmlFor="tanggal" className="mb-1 block text-sm font-medium text-gray-700">
//                             Tanggal Pakai
//                         </label>
//                         <input
//                             id="tanggal"
//                             type="date"
//                             value={tanggal}
//                             onChange={(e) => setTanggal(e.target.value)}
//                             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     {/* Durasi */}
//                     <div>
//                         <label htmlFor="durasi" className="mb-1 block text-sm font-medium text-gray-700">
//                             Durasi Pakai (Hari)
//                         </label>
//                         <input
//                             id="durasi"
//                             type="number"
//                             min="1"
//                             max="365"
//                             value={durasi}
//                             onChange={(e) => setDurasi(parseInt(e.target.value) || 1)}
//                             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     {/* Tipe pengiriman */}
//                     <div>
//                         <label htmlFor="tipePengiriman" className="mb-1 block text-sm font-medium text-gray-700">
//                             Tipe Pengiriman
//                         </label>
//                         <select
//                             id="tipePengiriman"
//                             value={tipePengiriman}
//                             onChange={(e) => setTipePengiriman(e.target.value)}
//                             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
//                         >
//                             <option value="nd">Next Day</option>
//                             <option value="sd">Same Day</option>
//                         </select>
//                     </div>

//                     {/* Asal pengiriman */}
//                     <div>
//                         <label htmlFor="branch" className="mb-1 block text-sm font-medium text-gray-700">
//                             Asal Pengiriman
//                         </label>
//                         <select
//                             id="branch"
//                             value={branch}
//                             onChange={(e) => setBranch(e.target.value)}
//                             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
//                         >
//                             {branches.map((b) => (
//                                 <option key={b.id} value={b.id}>
//                                     {b.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={handleSubmit}
//                         className="w-full rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition duration-200 ease-in-out hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
//                     >
//                         Cari Jadwal
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
