import { Product } from '@/types/models';
import { useEffect, useState } from 'react';
import ProductModalDetails from './product-modal-details';

interface ProductModalContentProps {
    product: Product;
    contact: string;
    onClose: () => void;
    selectedImage: string;
    setSelectedImage: (image: string) => void;
    setPreviewImage: (image: string) => void;
}

const ProductModalContent = ({ product, contact, onClose, selectedImage, setSelectedImage, setPreviewImage }: ProductModalContentProps) => {
    const [showHint, setShowHint] = useState<boolean>(true);
    const { cover_image, images, name: productName } = product;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative z-10 mx-auto flex h-[90vh] w-full max-w-5xl flex-col bg-white p-4 shadow-sm md:flex-row">
            {/* close button */}
            <button onClick={onClose} className="absolute -top-1 right-1 cursor-pointer text-sm text-gray-700 md:top-1 md:right-3 md:text-lg">
                x
            </button>

            {/* Left: Gallery */}
            <div className="flex h-1/2 w-full items-start justify-center gap-2 md:h-full md:w-1/2 lg:items-center lg:gap-4">
                {/* Thumbnails */}
                <div className="scrollbar-hide h-full w-17 flex-shrink-0 overflow-y-auto lg:w-20">
                    <div className="flex flex-col gap-1 md:gap-2">
                        {(images ? [cover_image, ...images] : [])
                            .filter((img): img is string => Boolean(img))
                            .map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`cursor-pointer overflow-hidden border-2 ${
                                        selectedImage === img ? 'border-first' : 'border-transparent'
                                    }`}
                                >
                                    <img src={`/storage/${img}`} alt={`Thumbnail ${i + 1}`} className="h-25 w-full object-cover" />
                                </button>
                            ))}
                    </div>
                </div>

                {/* Main image */}
                <div
                    className="relative flex h-full flex-1 cursor-zoom-in items-center justify-center"
                    onClick={() => setPreviewImage(selectedImage)}
                >
                    <img
                        src={
                            selectedImage
                                ? `/storage/${selectedImage}`
                                : 'https://plus.unsplash.com/premium_photo-1675186049409-f9f8f60ebb5e?q=80&w=687&auto=format&fit=crop'
                        }
                        alt={productName}
                        className="h-full w-full object-cover"
                    />

                    {showHint && (
                        <div className="animate-fade-out absolute inset-0 flex items-center justify-center bg-black/25">
                            <span className="text-md font-semibold text-white md:text-lg">Click to View Larger</span>
                        </div>
                    )}
                </div>
            </div>

            <ProductModalDetails product={product} contact={contact} />
        </div>
    );
};

export default ProductModalContent;
