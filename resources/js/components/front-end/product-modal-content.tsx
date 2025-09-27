import { Product } from '@/types/models';
import { formatRupiah, formatWhatsAppNumber } from '@/utils/format';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

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
    const { cover_image, images, name: productName, brand, description, code, price_detail, types, additional_ribbon, color, sizes } = product;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const getTypeList = () => types?.map((type) => type.name).join(', ');
    const getSizeList = () => sizes?.map((size) => size.size).join(', ');

    const whatsappNumber = formatWhatsAppNumber(contact);
    const message = `Hai, aku mau sewa *${productName} (${code}) di tanggal 27 September 2025* mohon infonya`;

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
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="text-md font-semibold text-white md:text-lg">Click to View Larger</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Detail Produk */}
            <div className="mt-auto flex h-1/2 w-full flex-col pl-0 md:mt-0 md:h-full md:w-1/2 md:pl-8">
                {/* Header info */}
                <div className="mt-3 mb-1 md:mt-0 md:mb-2">
                    <h2 className="mb-1 text-lg font-semibold text-slate-700 md:mb-2 md:text-xl">{productName}</h2>
                    <p className="mb-1 text-xs text-slate-500 md:text-sm">by {brand?.name}</p>
                    <p className="mb-1 text-xs text-slate-500 md:text-sm">code {code}</p>
                    <hr className="my-1 border-t border-slate-200" />
                    <div className="mt-0 flex items-center gap-2 md:mt-2">
                        {price_detail?.discount ? (
                            <>
                                <span className="text-xs text-slate-300 line-through">{formatRupiah(price_detail?.rent_price)}</span>
                                <span className="md:text-md text-sm font-semibold text-slate-700">
                                    {formatRupiah(price_detail?.price_after_discount ?? 0)}
                                </span>
                                <span className="ml-2 animate-pulse bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                                    -{price_detail?.discount}%
                                </span>
                            </>
                        ) : (
                            <span className="md:text-md text-sm font-semibold text-slate-700">{formatRupiah(price_detail?.rent_price)}</span>
                        )}
                    </div>
                    <hr className="my-1 border-t border-slate-200" />
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto pr-1">
                    <h2 className="mt-2 text-sm font-semibold text-slate-700">Deskripsi</h2>
                    <div className="prose mt-2 max-w-none text-xs text-slate-500" dangerouslySetInnerHTML={{ __html: description ?? '' }} />

                    {/* additional desc */}
                    <div className="mt-3 border-b border-slate-200 pb-3">
                        <table className="text-xs text-slate-500">
                            <tbody>
                                <tr>
                                    <td className="pr-2">Types</td>
                                    <td className="px-1">:</td>
                                    <td>{getTypeList()}</td>
                                </tr>
                                {additional_ribbon && (
                                    <tr>
                                        <td className="pr-2">Tags</td>
                                        <td className="px-1">:</td>
                                        <td>{additional_ribbon}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="pr-2">Sizes</td>
                                    <td className="px-1">:</td>
                                    <td>{getSizeList()}</td>
                                </tr>
                                <tr>
                                    <td className="pr-2">Available colors</td>
                                    <td className="px-1">:</td>
                                    <td>
                                        {color?.hex_code ? (
                                            <div className="flex items-center gap-1 py-1">
                                                <span
                                                    className="inline-block h-4 w-4 rounded-full"
                                                    style={{ backgroundColor: color.hex_code }}
                                                ></span>
                                                <span className="text-xs text-slate-500">{color.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-500">{color?.name}</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* additional info */}
                    <div className="mt-3">
                        <h2 className="mb-1 text-sm font-semibold text-slate-700">Informasi Tambahan</h2>
                        <table className="text-xs text-slate-500">
                            <tbody>
                                <tr>
                                    <td className="pr-2">Deposit</td>
                                    <td className="px-1">:</td>
                                    <td>{formatRupiah(price_detail?.deposit)}</td>
                                </tr>
                                <tr>
                                    <td className="pr-2">Extra Days</td>
                                    <td className="px-1">:</td>
                                    <td>{formatRupiah(price_detail?.additional_time_price)}/Day(s)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer button */}
                <div className="pt-3">
                    <a
                        href={`https://wa.me/${formatWhatsAppNumber(whatsappNumber ?? '08877935678')}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button className="w-full cursor-pointer rounded-none bg-first text-white transition-all duration-300 hover:bg-second">
                            Rent Now
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductModalContent;
