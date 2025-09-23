import { Product } from '@/types/models';
import { formatRupiah } from '@/utils/format';
import { Link } from '@inertiajs/react';
import { Tag } from 'lucide-react';

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <div key={product.id} className="group relative">
            <Link href="#">
                {/* Ribbon badge */}
                {product.additional_ribbon && (
                    <div className="absolute top-0 left-0 z-10 rounded-tl-sm rounded-br-sm bg-first px-1.5 py-0.5">
                        <p className="text-[10px] font-normal tracking-wide text-white md:text-[12px]">{product.additional_ribbon}</p>
                    </div>
                )}

                {/* Product image */}
                <div className="overflow-hidden rounded-sm">
                    <img
                        alt={product.name}
                        src={
                            product.cover_image
                                ? `/storage/${product.cover_image}`
                                : 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg'
                        }
                        className="aspect-[2/3] w-full transform bg-gray-200 object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
                    />
                </div>

                {/* Product info */}
                <div className="mt-2 flex justify-between px-0 lg:px-1">
                    <div className="space-y-1 lg:space-y-1.5">
                        <h2 className="md:text-md max-w-[127px] truncate text-sm font-semibold text-slate-700 lg:max-w-[210px]">{product.name}</h2>

                        <h3 className="max-w-[127px] truncate text-xs text-slate-500 lg:max-w-[210px]">By {product.brand?.name}</h3>

                        <p className="text-xs text-slate-500">
                            {formatRupiah(product.price_detail?.price_after_discount)}{' '}
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
            </Link>
        </div>
    );
};

export default ProductCard;
