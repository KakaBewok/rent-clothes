import { Product } from '@/types/models';
import { formatRupiah, formatWhatsAppNumber } from '@/utils/format';
import { Link } from '@inertiajs/react';
import { format, isValid, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import CalendarToggle from './calendar-toggle';

const ProductModalDetails = ({ product, contact }: { product: Product; contact: string }) => {
    const { brand, price_detail, code, name: productName, description, sizes, types, additional_ribbon, color } = product;
    const getTypeList = () => types?.map((type) => type.name).join(', ');
    const getSizeList = () => sizes?.map((size) => size.size).join(', ');
    const allSizesUnavailable = sizes?.every((size) => size.availability !== '1' || size.quantity === 0) ?? false;

    const queryParams = new URLSearchParams(window.location.search);

    const createMessage = () => {
        const useByDate = queryParams.get('useByDate') || '';

        const parsedUseByDate = parse(useByDate, 'dd-MM-yyyy', new Date());
        const validUseByDate = isValid(parsedUseByDate) ? parsedUseByDate : new Date();
        const completeUseByDate = format(validUseByDate, 'd MMMM yyyy', { locale: id });

        return `Hai! aku mau sewa *${productName} (${code})* di tanggal *${completeUseByDate}* Mohon infonya`;
    };

    const whatsappNumber = formatWhatsAppNumber(contact);
    const message = createMessage();

    return (
        <div className="mt-auto flex h-1/2 w-full flex-col pl-0 md:mt-0 md:h-full md:w-1/2 md:pl-8">
            {/* Scrollable content */}
            <div className="mt-3 flex-1 overflow-y-auto pr-1">
                {/* Header info */}
                <div className="mb-1 md:mt-0 md:mb-0">
                    <h2 className="mb-1 text-lg font-semibold text-slate-700 md:mb-2 md:text-xl">{productName}</h2>
                    <p className="mb-1 text-xs text-slate-500 md:text-sm">by {brand?.name}</p>
                    <p className="mb-1 text-xs text-slate-500 md:text-sm">code {code}</p>
                    <hr className="my-2 border-t border-slate-200" />
                    <div className="mt-0 flex items-center gap-2">
                        {price_detail?.discount ? (
                            <>
                                <span className="md:text-md text-sm font-semibold text-slate-700">
                                    {formatRupiah(price_detail?.price_after_discount ?? 0)}
                                </span>
                                <span className="animate-pulse text-xs text-slate-300 line-through">{formatRupiah(price_detail?.rent_price)}</span>
                                <span className="ml-2 animate-pulse bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                                    -{price_detail?.discount}%
                                </span>
                            </>
                        ) : (
                            <span className="md:text-md text-sm font-semibold text-slate-700">{formatRupiah(price_detail?.rent_price)}</span>
                        )}
                    </div>
                    <hr className="my-2 border-t border-slate-200" />
                </div>

                {/* calendar availibility */}
                <CalendarToggle allSizesUnavailable={allSizesUnavailable} product={product} />

                <div className="border-b border-slate-200 pt-2 pb-4">
                    {product.stock_breakdown && product.stock_breakdown.length > 0 ? (
                        <>
                            <h4 className="text-sm font-semibold text-slate-700">
                                <span>Stok Tersedia</span>
                            </h4>

                            <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                                {product.stock_breakdown.map((item) => (
                                    <React.Fragment key={item.size}>
                                        <span className="text-slate-500">{item.size}</span>
                                        <span className="text-slate-500">{item.stock} pcs</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="mt-0 text-sm text-slate-500">Tidak ada stok pada tanggal ini.</p>
                    )}
                </div>

                {/* desc */}
                <h2 className="mt-4 text-sm font-semibold text-slate-700">Deskripsi</h2>
                <div className="prose mt-2 max-w-none text-xs text-slate-500" dangerouslySetInnerHTML={{ __html: description ?? '' }} />

                {/* additional desc */}
                <div className="mt-3 border-b border-slate-200 pb-3">
                    <table className="text-xs text-slate-500">
                        <tbody>
                            {types && types.length > 0 && (
                                <tr>
                                    <td className="pr-2">Type</td>
                                    <td className="px-1">:</td>
                                    <td>{getTypeList()}</td>
                                </tr>
                            )}
                            {additional_ribbon && (
                                <tr>
                                    <td className="pr-2">Tags</td>
                                    <td className="px-1">:</td>
                                    <td>{additional_ribbon}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="pr-2">Size</td>
                                <td className="px-1">:</td>
                                <td>{getSizeList()}</td>
                            </tr>
                            <tr>
                                <td className="pr-2">Colour</td>
                                <td className="px-1">:</td>
                                <td>
                                    {color?.hex_code ? (
                                        <div className="flex items-center gap-1 py-1">
                                            <span className="inline-block h-4 w-4 rounded-full" style={{ backgroundColor: color.hex_code }}></span>
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

            {/* <div className="pt-3">
                <a
                    href={
                        product.stock_breakdown && product.stock_breakdown.length > 0
                            ? `https://wa.me/${formatWhatsAppNumber(whatsappNumber ?? '628877935678')}?text=${encodeURIComponent(message)}`
                            : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        disabled={!product.stock_breakdown || product.stock_breakdown.length === 0}
                        className={`w-full cursor-pointer rounded-none transition-all duration-300 ${
                            product.stock_breakdown && product.stock_breakdown.length > 0
                                ? 'bg-[#A27163] text-white hover:bg-[#976456]'
                                : 'cursor-not-allowed bg-slate-700 text-gray-50'
                        }`}
                    >
                        {product.stock_breakdown && product.stock_breakdown.length > 0 ? 'Rent Now' : 'Out of Stock'}
                    </Button>
                </a>
            </div> */}

            <div className="flex w-full flex-col gap-2 pt-3 md:flex-row">
                <a
                    href={
                        product.stock_breakdown && product.stock_breakdown.length > 0
                            ? `https://wa.me/${formatWhatsAppNumber(whatsappNumber ?? '628877935678')}?text=${encodeURIComponent(message)}`
                            : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full ${product.stock_breakdown && product.stock_breakdown.length > 0 ? 'md:w-1/2' : ''}`}
                >
                    <Button
                        className={`w-full cursor-pointer rounded-none transition-all duration-500 ${
                            product.stock_breakdown && product.stock_breakdown.length > 0
                                ? 'bg-[#565449] text-white hover:bg-[#565449]'
                                : 'cursor-not-allowed bg-slate-300 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                        <MessageCircle className="h-6 w-6" />
                        {product.stock_breakdown && product.stock_breakdown.length > 0 ? 'Chat Admin' : 'Out of Stock'}
                    </Button>
                </a>
                {product.stock_breakdown && product.stock_breakdown.length > 0 && (
                    <Link href="/form" target="_blank" rel="noopener noreferrer" className="w-full md:w-1/2">
                        <Button
                            className={`w-full cursor-pointer rounded-none bg-[#A27163] text-white transition-all duration-300 hover:bg-[#976456]`}
                        >
                            <ShoppingCart className="h-6 w-6" />
                            Rent Now
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProductModalDetails;
