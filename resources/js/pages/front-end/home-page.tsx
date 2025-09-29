import FloatingWhatsapp from '@/components/front-end/floating-whatsapp';
import Footer from '@/components/front-end/footer';
import Hero from '@/components/front-end/hero';
import ModalInfo from '@/components/front-end/ModalInfo';
import NavBar from '@/components/front-end/nav-bar';
import NoteBox from '@/components/front-end/note-box';
import ProductList from '@/components/front-end/product-list';
import ProductModal from '@/components/front-end/product-modal';
import ScheduleModal from '@/components/front-end/schedule-model';
import { AppSetting, Banner, Branch, Filter, Product } from '@/types/models';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HomePageProps {
    products: Product[];
    banners: Banner[];
    branchs: Branch[];
    appSetting: AppSetting;
    showModal: boolean;
    filter: Filter;
}

function HomePage({ branchs, products, banners, appSetting, showModal, filter }: HomePageProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalInfo, setModalInfo] = useState<string[] | null>(null);
    const [showHint, setShowHint] = useState<boolean>(true);
    const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);

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

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

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
            {showScheduleModal ?? alert('Modal muncul')}
            <div className="relative mx-auto min-h-screen max-w-screen-xl bg-white">
                <NavBar setting={safeSetting} setModalInfo={setModalInfo} setShowScheduleModal={setShowScheduleModal} />
                <Hero banners={banners} />
                <NoteBox />
                <ProductList products={products} onOpen={openProduct} />
                <Footer setting={appSetting} setModalInfo={setModalInfo} setShowScheduleModal={setShowScheduleModal} />
                <FloatingWhatsapp whatsapp_number={appSetting.whatsapp_number} />

                {/* Modals */}
                {selectedProduct && (
                    <ProductModal product={selectedProduct} contact={appSetting.whatsapp_number ?? ''} onClose={onCloseProductModal} />
                )}
                {modalInfo && modalInfo.length > 0 && <ModalInfo setModalInfo={setModalInfo} modalInfo={modalInfo} showHint={showHint} />}
                {showScheduleModal && (
                    <ScheduleModal branchs={branchs} filter={filter} isUnclose={showModal} onClose={() => setShowScheduleModal(false)} />
                )}
            </div>
        </div>
    );
}

export default HomePage;
