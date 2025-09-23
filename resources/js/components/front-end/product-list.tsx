import { Product } from '@/types/models';
import ProductCard from './product-card';

const ProductList = ({ products }: { products: Product[] }) => {
    return (
        <div className="w-full">
            <div className="mx-auto px-4 py-4 md:px-6 md:py-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Product Overview</h2>

                <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <ProductCard product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
