import { Product } from '@/types/models';
import { useState } from 'react';
import ProductModalContent from './product-modal-content';

interface ProductModalProps {
    product: Product;
    contact: string;
    onClose: () => void;
}

const ProductModal = ({ product, contact, onClose }: ProductModalProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(product.cover_image ?? null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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

            {/* Full Image Preview Overlay */}
            {previewImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 cursor-pointer bg-black opacity-80" onClick={() => setPreviewImage(null)} />
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-1 right-1 cursor-pointer text-3xl text-white md:top-2 md:right-2 lg:top-4 lg:right-4"
                    >
                        ✕
                    </button>
                    <img src={`/storage/${previewImage}`} alt="Full Preview" className="z-[99] max-h-[95%] max-w-[95%] object-contain" />
                </div>
            )}
        </div>
    );
};

export default ProductModal;
