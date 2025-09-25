import { Product } from '@/types/models';
import ProductCardContent from './product-card-content';

interface ProductProps {
    product: Product;
    onOpen: (id: number) => void;
}

const ProductCard = ({ product, onOpen }: ProductProps) => {
    return (
        <div key={product.id} className="group relative">
            <div
                role="button"
                tabIndex={0}
                onClick={() => onOpen(product.id)}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(product.id)}
                className="cursor-pointer"
            >
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
                <ProductCardContent product={product} />
            </div>
        </div>
    );
};

export default ProductCard;
