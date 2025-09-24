import FloatingWhatsapp from '@/components/front-end/floating-whatsapp';
import Footer from '@/components/front-end/footer';
import Hero from '@/components/front-end/hero';
import NavBar from '@/components/front-end/nav-bar';
import NoteBox from '@/components/front-end/note-box';
import ProductList from '@/components/front-end/product-list';
import { AppSetting, Banner, Product } from '@/types/models';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HomePageProps {
    products: Product[];
    banners: Banner[];
    appSetting: AppSetting;
}

function HomePage({ products, banners, appSetting }: HomePageProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const metaDesc =
        appSetting.description ?? 'Koleksi pakaian eksklusif untuk setiap acara. Nikmati pengalaman sewa yang nyaman, cepat, dan berkualitas tinggi.';

    const safeSetting: AppSetting = appSetting ?? {
        app_logo: null,
        app_name: 'Qatia Rent',
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-first" />
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50">
            <meta name="description" content={`${metaDesc}`} />
            <div className="relative mx-auto min-h-screen max-w-screen-xl bg-white">
                <NavBar setting={safeSetting} />
                <Hero banners={banners} />
                <NoteBox />
                <ProductList products={products} />
                <Footer setting={appSetting} />
                <FloatingWhatsapp whatsapp_number={appSetting.whatsapp_number} />
            </div>
        </div>
    );
}

export default HomePage;

//  <ScheduleModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 initialValues={{
//                     useByDate: useByDate || '',
//                     duration: duration || 1,
//                     city: city || '',
//                     shippingType: shippingType || '',
//                 }}
//             />

//  <nav className="sticky top-0 z-40 bg-white">
//                     <div className="container mx-auto px-4">
//                         <div className="flex h-16 items-center justify-between">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <h1 className="text-2xl font-bold text-indigo-600">RentalFashion</h1>
//                                 </div>
//                             </div>

//                             {/* Desktop Menu */}
//                             <div className="hidden md:block">
//                                 <div className="ml-10 flex items-baseline space-x-4">
//                                     <a href="#" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-indigo-600">
//                                         Beranda
//                                     </a>
//                                     <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600">
//                                         Katalog
//                                     </a>
//                                     <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600">
//                                         Tentang
//                                     </a>
//                                     <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600">
//                                         Kontak
//                                     </a>
//                                 </div>
//                             </div>

//                             <div className="hidden items-center space-x-4 md:flex">
//                                 <button className="text-gray-500 hover:text-indigo-600">
//                                     <Heart className="h-6 w-6" />
//                                 </button>
//                                 <button className="text-gray-500 hover:text-indigo-600">
//                                     <ShoppingBag className="h-6 w-6" />
//                                 </button>
//                                 <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700">Login</button>
//                             </div>

//                             {/* Mobile menu button */}
//                             <div className="md:hidden">
//                                 <button
//                                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                                     className="relative flex h-6 w-6 items-center justify-center text-gray-700"
//                                 >
//                                     <Menu
//                                         className={`absolute h-6 w-6 transform transition-all duration-300 ${
//                                             isMenuOpen ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
//                                         }`}
//                                     />
//                                     <X
//                                         className={`absolute h-6 w-6 transform transition-all duration-300 ${
//                                             isMenuOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
//                                         }`}
//                                     />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Mobile Menu */}
//                     <div
//                         className={`transform transition-all duration-300 ease-in-out md:hidden ${
//                             isMenuOpen ? 'max-h-96 scale-100 opacity-100' : 'max-h-0 scale-95 opacity-0'
//                         } overflow-hidden`}
//                     >
//                         <div className="space-y-1 border-t bg-white px-2 pt-2 pb-3 sm:px-3">
//                             <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900">
//                                 Beranda
//                             </a>
//                             <a href="#" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900">
//                                 Katalog
//                             </a>
//                             <a href="#" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900">
//                                 Tentang
//                             </a>
//                             <a href="#" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900">
//                                 Kontak
//                             </a>
//                             <button className="mt-4 w-full rounded-lg bg-indigo-600 px-3 py-2 text-left text-base font-medium text-white">
//                                 Login
//                             </button>
//                         </div>
//                     </div>
//                 </nav>
