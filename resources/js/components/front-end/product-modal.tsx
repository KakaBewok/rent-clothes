import { Product } from '@/types/models';
import { useEffect, useState } from 'react';
import { CarouselApi } from '../ui/carousel';
import FullPreviewImage from './full-preview-image';
import ProductModalContent from './product-modal-content';

interface ProductModalProps {
    product: Product;
    contact: string;
    onClose: () => void;
}

const ProductModal = ({ product, contact, onClose }: ProductModalProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(product.cover_image ?? null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [api, setApi] = useState<CarouselApi>();
    const [showHint, setShowHint] = useState<boolean>(true);

    const images = [product.cover_image, ...(product.images ?? [])].filter(Boolean) as string[];
    const selectedIndex = images.findIndex((img) => img === selectedImage);

    useEffect(() => {
        if (api && selectedIndex >= 0) {
            api.scrollTo(selectedIndex, true); // true = instant scroll
        }
    }, [api, selectedIndex]);

    useEffect(() => {
        if (previewImage) {
            setShowHint(true);
            const timer = setTimeout(() => setShowHint(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [previewImage]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

            {/* Modal content */}
            <div className="w-full p-3 lg:p-0">
                <ProductModalContent
                    product={product}
                    contact={contact}
                    onClose={onClose}
                    selectedImage={selectedImage ?? ''}
                    setSelectedImage={setSelectedImage}
                    setPreviewImage={setPreviewImage}
                />
            </div>

            {previewImage && <FullPreviewImage setPreviewImage={setPreviewImage} setApi={setApi} images={images} showHint={showHint} />}
        </div>
    );
};

export default ProductModal;
