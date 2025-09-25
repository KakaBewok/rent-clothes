import { Product } from '@/types/models';

interface ProductModalContentProps {
    product: Product;
    onClose: () => void;
    selectedImage: string;
    setSelectedImage: (image: string) => void;
    setPreviewImage: (image: string) => void;
}

const ProductModalContent = ({ product, onClose, selectedImage, setSelectedImage, setPreviewImage }: ProductModalContentProps) => {
    return (
        <div className="relative z-10 mx-auto flex h-[90vh] w-full max-w-5xl flex-col rounded-sm bg-white p-4 shadow-sm md:flex-row">
            <button onClick={onClose} className="absolute -top-1 right-1 cursor-pointer text-sm text-gray-700 md:top-1 md:right-3 md:text-lg">
                x
            </button>

            {/* Left: Gallery */}
            <div className="flex h-[40vh] w-full items-start justify-center gap-2 md:h-full md:w-1/2 lg:items-center lg:gap-4">
                {/* Thumbnails */}
                <div className="scrollbar-hide h-full w-17 flex-shrink-0 overflow-y-auto lg:w-20">
                    <div className="flex flex-col gap-1 md:gap-2">
                        {(product.images ? [...product.images, product.cover_image] : [])
                            .filter((img): img is string => Boolean(img))
                            .map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`cursor-pointer overflow-hidden border-2 ${selectedImage === img ? 'border-first' : 'border-transparent'}`}
                                >
                                    <img src={`/storage/${img}`} alt={`Thumbnail ${i + 1}`} className="h-25 w-full object-cover" />
                                </button>
                            ))}
                    </div>
                </div>

                {/* Main image */}
                <div className="flex h-full flex-1 cursor-zoom-in items-center justify-center" onClick={() => setPreviewImage(selectedImage)}>
                    <img
                        src={
                            selectedImage
                                ? `/storage/${selectedImage}`
                                : 'https://plus.unsplash.com/premium_photo-1675186049409-f9f8f60ebb5e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        }
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            {/* LANJUTKAN */}
            {/* right: Detail Produk */}
            <div className="w-full pl-3 md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
        </div>
    );
};

export default ProductModalContent;
