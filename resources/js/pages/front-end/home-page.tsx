import FloatingWhatsapp from '@/components/front-end/floating-whatsapp';
import Footer from '@/components/front-end/footer';
import Hero from '@/components/front-end/hero';
import ModalInfo from '@/components/front-end/modal-info';
import NavBar from '@/components/front-end/nav-bar';
import NoteBox from '@/components/front-end/note-box';
import ProductFilter from '@/components/front-end/product-filter';
import ProductList from '@/components/front-end/product-list';
import ProductModal from '@/components/front-end/product-modal';
import ScheduleModal from '@/components/front-end/schedule-model';
import { AppSetting, Banner, Branch, Brand, Color, Filter, PaginatedProducts, Product, Type } from '@/types/models';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HomePageProps {
    products: PaginatedProducts;
    banners: Banner[];
    branchs: Branch[];
    brands: Brand[];
    colors: Color[];
    types: Type[];
    appSetting: AppSetting;
    showModal: boolean;
    baseFilters: Filter;
}

function HomePage({ branchs, products, banners, appSetting, showModal, baseFilters, brands, colors, types }: HomePageProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalInfo, setModalInfo] = useState<string[] | null>(null);
    const [showHint, setShowHint] = useState<boolean>(true);
    const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    const openProduct = async (id: number) => {
        setScrollPosition(window.pageYOffset);

        setLoading(true);
        try {
            const res = await axios.get(`/api/products/stock/${id}`, {
                params: baseFilters,
            });
            setSelectedProduct(res.data as Product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const onCloseProductModal = () => {
        setSelectedProduct(null);

        requestAnimationFrame(() => {
            window.scrollTo(0, scrollPosition);
        });
    };

    const safeSetting: AppSetting = appSetting ?? {
        app_logo: null,
        app_name: 'Qatia Rent',
    };

    useEffect(() => {
        if (showModal) {
            setShowScheduleModal(true);
        }
    }, [showModal]);

    // useEffect(() => {
    //     const timer = setTimeout(() => setLoading(false), 300);
    //     return () => clearTimeout(timer);
    // }, []);

    useEffect(() => {
        if (products && banners) {
            const timer = setTimeout(() => setLoading(false), 200);
            return () => clearTimeout(timer);
        }
    }, [products, banners]);

    useEffect(() => {
        if (modalInfo) {
            setShowHint(true);
            const timer = setTimeout(() => setShowHint(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [modalInfo]);

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
                <NavBar setting={safeSetting} setModalInfo={setModalInfo} setShowScheduleModal={setShowScheduleModal} />
                <Hero banners={banners} />
                <ProductFilter baseFilters={baseFilters} brands={brands} colors={colors} types={types} />
                <NoteBox branchs={branchs} />
                <ProductList products={products} onOpen={openProduct} />
                <Footer setting={appSetting} setModalInfo={setModalInfo} setShowScheduleModal={setShowScheduleModal} />
                <FloatingWhatsapp whatsapp_number={appSetting.whatsapp_number} />

                {/* Modals */}
                {selectedProduct && (
                    <ProductModal product={selectedProduct} contact={appSetting.whatsapp_number ?? ''} onClose={onCloseProductModal} />
                )}
                {modalInfo && modalInfo.length > 0 && <ModalInfo setModalInfo={setModalInfo} modalInfo={modalInfo} showHint={showHint} />}
                {showScheduleModal && (
                    <ScheduleModal branchs={branchs} baseFilters={baseFilters} isUnclose={showModal} onClose={() => setShowScheduleModal(false)} />
                )}
            </div>
        </div>
    );
}

export default HomePage;
