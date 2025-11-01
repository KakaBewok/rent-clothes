import { PaginatedProducts, Product } from '@/types/models';
import PaginationView from './pagination';
import ProductCard from './product-card';

interface ProductListProps {
    products: PaginatedProducts;
    onOpen: (id: number) => void;
}

const ProductList = ({ products, onOpen }: ProductListProps) => {
    const { data, meta } = products;

    return (
        <div className="w-full">
            <div className="mx-auto px-4 py-4 md:px-6 md:py-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Your Style Pick</h2>
                <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 xl:gap-x-8">
                    {data.length > 0 ? (
                        data.map((product: Product) => <ProductCard key={product.id} product={product} onOpen={onOpen} />)
                    ) : (
                        <div className="col-span-full grid h-100 place-items-center">
                            <p className="text-center text-sm text-slate-700">No products available at the moment.</p>
                        </div>
                    )}
                </div>

                {meta.last_page > 1 && <PaginationView meta={meta} />}
            </div>
        </div>
    );
};

export default ProductList;
