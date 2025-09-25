import { Product } from '@/types/models';
import { formatRupiah } from '@/utils/format';
import { Tag } from 'lucide-react';

const ProductCardContent = ({ product }: { product: Product }) => {
    return (
        <div className="mt-2 flex justify-between px-0 lg:px-1">
            <div className="space-y-1 lg:space-y-1.5">
                <h2 className="md:text-md max-w-[127px] truncate text-sm font-semibold text-slate-700 lg:max-w-[210px]">{product.name}</h2>

                <h3 className="max-w-[127px] truncate text-xs text-slate-500 lg:max-w-[210px]">By {product.brand?.name}</h3>

                <p className="text-xs text-slate-500">
                    {formatRupiah(product.price_detail?.price_after_discount)}
                    {product.rent_periode === 1 ? '/1 day' : `/1-${product.rent_periode} days`}
                </p>

                {product.types && product.types.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                        <Tag className="h-3 w-3 text-green-500 md:h-4 md:w-4" />
                        {product.types.slice(0, 2).map((t) => (
                            <span key={t.id} className="rounded bg-green-50 px-1 py-0.5 text-[9px] font-medium text-green-600 md:text-[10px]">
                                {t.name}
                            </span>
                        ))}
                        {product.types.length > 2 && (
                            <span className="rounded bg-slate-50 px-1 py-0.5 text-[9px] text-slate-400 md:text-[10px]">
                                +{product.types.length - 2}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* sizes */}
            <div className="flex flex-col items-end">
                <div className="flex flex-wrap justify-end gap-1">
                    {(() => {
                        const availableSizes = product.sizes?.filter((size) => size.availability == '1') || [];
                        return (
                            <>
                                {availableSizes.slice(0, 2).map((s) => (
                                    <span key={s.id} className="rounded bg-slate-100 px-1 py-0.5 text-[9px] text-slate-500 md:text-[10px]">
                                        {s.size}
                                    </span>
                                ))}

                                {availableSizes.length > 2 && (
                                    <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] text-slate-500 md:text-[10px]">
                                        + {availableSizes.length - 2}
                                    </span>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default ProductCardContent;
