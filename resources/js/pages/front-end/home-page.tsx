// import { Product } from '@/types/models';
// import { useState } from 'react';
// import ScheduleModal from '../../components/front-end/schedule-model';

// interface HomeProps {
//     data: Product[];
//     filters: string[];
//     isModalScheduleOpen: boolean;
// }

// export default function Home({ data, filter, isModalScheduleOpen }: HomeProps) {
//     const [isModalOpen, setIsModalOpen] = useState(isModalScheduleOpen);

//     return (
//         <div className="h-screen w-full">
//             {/* Modal Check Jadwal */}
//             <ScheduleModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 initialValues={{
//                     useByDate: useByDate || '',
//                     duration: duration || 1,
//                     city: city || '',
//                     shippingType: shippingType || '',
//                 }}
//             />

//             {/* Halaman Home */}
//             <h1 className="mb-4 text-2xl font-bold">Product Overview</h1>
//             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                 {products.map((p: Product) => (
//                     <div key={p.id} className="rounded border p-2">
//                         <img src={p.cover_image} alt={p.name} className="h-40 w-full object-cover" />
//                         <h2 className="font-semibold">{p.name}</h2>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
