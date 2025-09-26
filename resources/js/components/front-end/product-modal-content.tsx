import { Product } from '@/types/models';
import { formatRupiah } from '@/utils/format';

interface ProductModalContentProps {
    product: Product;
    onClose: () => void;
    selectedImage: string;
    setSelectedImage: (image: string) => void;
    setPreviewImage: (image: string) => void;
}

const ProductModalContent = ({ product, onClose, selectedImage, setSelectedImage, setPreviewImage }: ProductModalContentProps) => {
    const { cover_image, images, name: productName, brand, description, code, price_detail } = product;

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
                        {(images ? [cover_image, ...images] : [])
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
                        alt={productName}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            {/* LANJUTKAN */}
            {/* right: Detail Produk */}
            <div className="w-full border border-red-500 pl-0 md:w-1/2 md:pl-4">
                <h2 className="mb-2 text-xl font-semibold text-slate-700">{productName}</h2>
                <p className="mb-1 text-sm text-slate-500">by {brand?.name}</p>
                <p className="mb-1 text-sm text-slate-500">code {code}</p>
                <hr className="my-4 border-t border-slate-200" />
                {/* <h3 className="text-md font-semibold text-slate-700">{formatRupiah(price_detail?.rent_price)}</h3> */}
                <div className="mt-2 flex items-center gap-2">
                    {price_detail?.discount ? (
                        <>
                            {/* first price */}
                            <span className="text-sm text-slate-300 line-through">{formatRupiah(price_detail?.rent_price)}</span>

                            {/* price after discount */}
                            <span className="text-xl font-semibold text-slate-700">{formatRupiah(price_detail?.price_after_discount ?? 0)}</span>

                            {/* Badge discount */}
                            <span className="ml-2 animate-pulse bg-red-600 px-2 py-0.5 text-xs font-bold text-white">-{price_detail?.discount}%</span>
                        </>
                    ) : (
                        <span className="text-xl font-semibold text-slate-700">{formatRupiah(price_detail?.rent_price)}</span>
                    )}
                </div>
                <hr className="my-4 border-t border-slate-200" />
                <div className="prose mt-2 max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: description ?? '' }} />
            </div>
        </div>
    );
};

export default ProductModalContent;
