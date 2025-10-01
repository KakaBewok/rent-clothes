import { Product, Size } from '@/types/models';
import { formatRupiah } from '@/utils/format';
import { Tag } from 'lucide-react';

const ProductCardContent = ({ product }: { product: Product }) => {
    const { brand, name: productName, price_detail, rent_periode, types } = product;

    function renderSizes(sizes: Size[]) {
        if (sizes.length <= 2) {
            return sizes.map((s) => (
                <div key={s.id} className="bg-slate-100 px-1 py-0.5 text-[9.5px] font-medium text-slate-600 lg:text-[11px]">
                    {s.size}
                </div>
            ));
        }

        return (
            <>
                <div key={sizes[0].id} className="rounded bg-slate-100 px-1 py-0.5 text-[9.5px] font-medium text-slate-600 lg:text-[11px]">
                    {sizes[0].size}
                </div>
                <div className="rounded bg-slate-100 px-1 py-0.5 text-[9.5px] font-medium text-slate-600 lg:text-[11px]">+ {sizes.length - 1}</div>
            </>
        );
    }

    return (
        <div className="mt-2 flex justify-between px-0 lg:px-1">
            {/* left */}
            <div className="">
                <h2 className="line-clamp-1 max-w-[117px] text-sm font-semibold text-slate-700 lg:line-clamp-2 lg:max-w-[200px] lg:text-lg">
                    {productName}
                </h2>

                <h3 className="mb-2.5 max-w-[110px] truncate text-xs text-slate-400 lg:mb-3 lg:max-w-[210px]">By {brand?.name}</h3>

                <p className="text-xs font-semibold text-slate-700 lg:text-sm">
                    {formatRupiah(price_detail?.price_after_discount)}
                    {rent_periode === 1 ? '/1 day' : `/1-${rent_periode} days`}
                </p>

                {price_detail?.discount && (
                    <p>
                        <span className="animate-pulse text-xs text-slate-300 line-through lg:text-sm">{formatRupiah(price_detail?.rent_price)}</span>
                        <span className="ml-2 animate-pulse text-xs font-bold text-red-300 lg:text-sm">-{price_detail?.discount}%</span>
                    </p>
                )}

                {types && types.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1 lg:mt-3">
                        <Tag className="h-3 w-3 text-green-500 md:h-4 md:w-4" />
                        {types.slice(0, 2).map((t) => (
                            <span key={t.id} className="rounded bg-green-50 px-1 py-0.5 text-[9px] font-medium text-green-600 md:text-[10px]">
                                {t.name}
                            </span>
                        ))}
                        {types.length > 2 && (
                            <span className="rounded bg-green-50 px-1 py-0.5 text-[9px] text-green-600 md:text-[10px]">+{types.length - 2}</span>
                        )}
                    </div>
                )}
            </div>

            {/* right - sizes */}
            <div className="flex h-fit w-fit flex-col items-end">
                <div className="flex flex-col flex-wrap items-end gap-1">
                    {(() => {
                        const availableSizes = product.sizes?.filter((size) => size.availability === '1') || [];
                        return renderSizes(availableSizes);
                    })()}
                </div>
            </div>
        </div>
    );
};

export default ProductCardContent;
