import { Product } from '@/types/models';
import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import ProductModalContent from './product-modal-content';

interface ProductModalProps {
    product: Product;
    contact: string;
    onClose: () => void;
}

const ProductModal = ({ product, contact, onClose }: ProductModalProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(product.cover_image ?? null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // changes
    // const images = [product.cover_image, ...(product.images ?? [])].filter(Boolean);
    const images = [product.cover_image, ...(product.images ?? [])].filter(Boolean) as string[];
    //changes

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

            {/* changes */}
            {previewImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    {/* Overlay */}
                    <div className="absolute inset-0 z-[70] cursor-pointer bg-black opacity-80" onClick={() => setPreviewImage(null)} />
                    {/* Close Button */}
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-1 right-1 z-[80] cursor-pointer text-3xl text-white md:top-2 md:right-2 lg:top-4 lg:right-4"
                    >
                        ✕
                    </button>

                    {/* Carousel */}
                    <Carousel opts={{ loop: true }} className="z-[70] flex h-full w-full items-center justify-center">
                        <CarouselContent className="h-full w-full">
                            {images.map((slide, i) => (
                                <CarouselItem key={i} className="flex items-center justify-center">
                                    <img src={`/storage/${slide}`} alt="Gallery full preview" className="max-h-[95vh] max-w-[95vw] object-contain" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            )}
            {/* changes */}
        </div>
    );
};

export default ProductModal;

{
    /* Full Image Preview Overlay */
}
{
    /* {previewImage && (
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
            )} */
}
