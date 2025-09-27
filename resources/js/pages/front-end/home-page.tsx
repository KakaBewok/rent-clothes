import FloatingWhatsapp from '@/components/front-end/floating-whatsapp';
import Footer from '@/components/front-end/footer';
import Hero from '@/components/front-end/hero';
import NavBar from '@/components/front-end/nav-bar';
import NoteBox from '@/components/front-end/note-box';
import ProductList from '@/components/front-end/product-list';
import ProductModal from '@/components/front-end/product-modal';
import { AppSetting, Banner, Product } from '@/types/models';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HomePageProps {
    products: Product[];
    banners: Banner[];
    appSetting: AppSetting;
}

function HomePage({ products, banners, appSetting }: HomePageProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openProduct = async (id: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/products/${id}`);
            setSelectedProduct(res.data as Product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const onCloseProductModal = () => {
        setSelectedProduct(null);
        router.get(
            '/',
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const safeSetting: AppSetting = appSetting ?? {
        app_logo: null,
        app_name: 'Qatia Rent',
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
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
            <div className="relative mx-auto min-h-screen max-w-screen-xl bg-white">
                <NavBar setting={safeSetting} />
                <Hero banners={banners} />
                <NoteBox />
                <ProductList products={products} onOpen={openProduct} />
                <Footer setting={appSetting} />
                <FloatingWhatsapp whatsapp_number={appSetting.whatsapp_number} />

                {selectedProduct && (
                    <ProductModal product={selectedProduct} contact={appSetting.whatsapp_number ?? ''} onClose={onCloseProductModal} />
                )}
            </div>
        </div>
    );
}

export default HomePage;
