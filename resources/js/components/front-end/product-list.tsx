import { Product } from '@/types/models';
import { Link } from '@inertiajs/react';
import { Tag } from 'lucide-react';

const ProductList = ({ products }: { products: Product[] }) => {
    console.log(products);

    // Dummy data for products
    const catalogue = [
        {
            id: 1,
            name: 'Basic Tee Basic Tee Basic Tee',
            href: '#',
            imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
            imageAlt: "Front of men's Basic Tee in black.",
            price: 'Rp. 270.000',
            color: 'Black',
            tags: 'New Arrival',
            type: 'Hijab Friendly',
            brand: 'Zalora',
            days: 3,
            size: 'M',
        },
        {
            id: 2,
            name: 'Basic Tee sdjfhsjdfjsdhfsd djhfjdsf hhghg hghhghjg hghhhghg',
            href: '#',
            imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg',
            imageAlt: "Front of men's Basic Tee in white.",
            price: 'Rp. 270.000',
            color: 'Aspen White',
            tags: '',
            type: 'Hijab Friendly',
            brand: 'Zambrud',
            days: 3,
            size: 'Fit XL',
        },
        {
            id: 3,
            name: 'Basic Tee',
            href: '#',
            imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg',
            imageAlt: "Front of men's Basic Tee in dark gray.",
            price: 'Rp. 270.000',
            color: 'Charcoal',
            tags: '',
            type: '',
            brand: 'Zalora',
            days: 3,
            size: 'M',
        },
        {
            id: 4,
            name: 'Artwork Tee',
            href: '#',
            imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg',
            imageAlt: "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
            price: 'Rp. 270.000',
            color: 'Iso Dots',
            tags: 'Promo',
            type: '',
            brand: 'Zambrud',
            days: 3,
            size: 'Fit M',
        },
        {
            id: 1,
            name: 'Basic Tee',
            href: '#',
            imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
            imageAlt: "Front of men's Basic Tee in black.",
            price: 'Rp. 270.000',
            color: 'Black',
            tags: 'New Arrival',
            type: 'Hijab Friendly',
            brand: 'Zalora',
            days: 3,
            size: 'Fit M',
        },
        {
            id: 2,
            name: 'Basic Tee',
            href: '#',
            imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg',
            imageAlt: "Front of men's Basic Tee in white.",
            price: 'Rp. 270.000',
            color: 'Aspen White',
            tags: '',
            type: 'Hijab Friendly',
            brand: 'Zambrud',
            days: 3,
            size: 'Fit S',
        },
        {
            id: 3,
            name: 'Basic Tee',
            href: '#',
            imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg',
            imageAlt: "Front of men's Basic Tee in dark gray.",
            price: 'Rp. 270.000',
            color: 'Charcoal',
            tags: '',
            type: '',
            brand: 'Zalora',
            days: 3,
            size: 'Fit M',
        },
        {
            id: 4,
            name: 'Artwork Tee',
            href: '#',
            imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg',
            imageAlt: "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
            price: 'Rp. 270.000',
            color: 'Iso Dots',
            tags: 'Promo',
            type: '',
            brand: 'Zambrud',
            days: 3,
            size: 'M',
        },
    ];

    return (
        <div className="w-full">
            <div className="mx-auto px-4 py-4 md:px-6 md:py-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Product Overview</h2>

                <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 xl:gap-x-8">
                    {catalogue.map((product) => (
                        <div key={product.id} className="group relative">
                            <Link href={product.href}>
                                {product.tags && (
                                    <div className="absolute top-0 left-0 z-10 rounded-tl-sm rounded-br-sm bg-first px-2 py-1">
                                        <p className="text-xs font-normal text-white">{product.tags}</p>
                                    </div>
                                )}
                                <img
                                    alt={product.imageAlt}
                                    src={product.imageSrc}
                                    className="aspect-square w-full transform rounded-sm bg-gray-200 object-cover transition-all duration-300 group-hover:opacity-75 hover:scale-105 lg:aspect-auto lg:h-80"
                                />
                                <div className="mt-2 flex justify-between px-0 md:px-1">
                                    <div className="space-y-1 lg:space-y-1.5">
                                        <h2 className="md:text-md max-w-[127px] truncate text-sm font-semibold text-slate-700 lg:max-w-[210px]">
                                            {product.name}
                                        </h2>
                                        <h3 className="text-xs text-slate-500">By {product.brand}</h3>
                                        <p className="text-xs text-slate-500">
                                            {product.price}/1-{product.days} days
                                        </p>
                                        {product.type && (
                                            <div className="flex items-center gap-1">
                                                <Tag className="h-5 w-5 text-green-500" />
                                                <p className="text-xs font-semibold text-green-500">{product.type}</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-medium text-slate-600">{product.size}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
