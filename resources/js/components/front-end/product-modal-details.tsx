import { Product } from '@/types/models';
import { formatRupiah, formatWhatsAppNumber } from '@/utils/format';
import { format, isValid, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '../ui/button';

const ProductModalDetails = ({ product, contact }: { product: Product; contact: string }) => {
    const { brand, price_detail, code, name: productName, description, sizes, types, additional_ribbon, color } = product;
    const getTypeList = () => types?.map((type) => type.name).join(', ');
    const getSizeList = () => sizes?.map((size) => size.size).join(', ');

    const queryParams = new URLSearchParams(window.location.search);

    const createMessage = () => {
        const useByDate = queryParams.get('useByDate') || '';
        const duration = Number(queryParams.get('duration') || 1);

        const parsedUseByDate = parse(useByDate, 'dd-MM-yyyy', new Date());
        const validUseByDate = isValid(parsedUseByDate) ? parsedUseByDate : new Date();
        const completeUseByDate = format(validUseByDate, 'EEEE, d MMMM yyyy', { locale: id });

        return `Hai! aku mau sewa *${productName} (${code})* mulai hari *${completeUseByDate}* selama *${duration} hari*. Mohon infonya`;
    };

    const whatsappNumber = formatWhatsAppNumber(contact);
    const message = createMessage();

    return (
        <div className="mt-auto flex h-1/2 w-full flex-col pl-0 md:mt-0 md:h-full md:w-1/2 md:pl-8">
            {/* Scrollable content */}
            <div className="mt-3 flex-1 overflow-y-auto pr-1">
                {/* Header info */}
                <div className="mb-1 md:mt-0 md:mb-2">
                    <h2 className="mb-1 text-lg font-semibold text-slate-700 md:mb-2 md:text-xl">{productName}</h2>
                    <p className="mb-1 text-xs text-slate-500 md:text-sm">by {brand?.name}</p>
                    <p className="mb-1 text-xs text-slate-500 md:text-sm">code {code}</p>
                    <hr className="my-2 border-t border-slate-200" />
                    <div className="mt-0 flex items-center gap-2">
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
                    <hr className="my-2 border-t border-slate-200" />
                </div>

                {/* desc */}
                <h2 className="mt-3 text-sm font-semibold text-slate-700">Deskripsi</h2>
                <div className="prose mt-2 max-w-none text-xs text-slate-500" dangerouslySetInnerHTML={{ __html: description ?? '' }} />

                {/* additional desc */}
                <div className="mt-3 border-b border-slate-200 pb-3">
                    <table className="text-xs text-slate-500">
                        <tbody>
                            {types && types.length > 0 && (
                                <tr>
                                    <td className="pr-2">Types</td>
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

            <div className="pt-3">
                <a
                    href={`https://wa.me/${formatWhatsAppNumber(whatsappNumber ?? '628877935678')}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button className="w-full cursor-pointer rounded-none bg-[#A27163] text-white transition-all duration-300 hover:bg-second">
                        Rent Now
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default ProductModalDetails;
