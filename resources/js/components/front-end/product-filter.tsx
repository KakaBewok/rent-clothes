/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Brand, Color, ExtraFilter, Filter as filterType, Product, Type } from '@/types/models';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Filter, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BrandSelect } from './brand-select';
import FilterWithChip from './filter-with-chip';

interface ProductFilterProps {
    brands: Brand[];
    colors: Color[];
    types: Type[];
    baseFilters: filterType;
}

const ProductFilter = ({ baseFilters, brands, colors, types }: ProductFilterProps) => {
    const [extraFilters, setExtraFilters] = useState<ExtraFilter | null>(null);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [allProductsAvailable, setAllProductsAvailable] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProductsAvail = async () => {
            try {
                const res = await axios.get(`/api/products`, {
                    params: baseFilters,
                });
                setAllProductsAvailable(res.data as Product[]);
            } catch (error) {
                console.error('Error fetching products available:', error);
            }
        };

        fetchProductsAvail();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const filters: Record<string, any> = {};

        const ARRAY_KEYS = ['color', 'type'];

        FILTER_KEYS.forEach((key) => {
            if (params.has(key)) {
                const value = params.get(key)!;

                if (ARRAY_KEYS.includes(key)) {
                    filters[key] = value.split(',').map((v) => Number(v.trim()));
                } else if (!isNaN(Number(value)) && value.trim() !== '') {
                    filters[key] = Number(value);
                } else {
                    filters[key] = value;
                }
            }
        });

        if (params.get('available') === 'true') {
            filters['available'] = true;
        }

        if (params.has('search')) {
            filters['search'] = params.get('search');
        }

        setExtraFilters(filters);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setExtraFilters({ ...extraFilters, search: query });

        if (query.length > 0) {
            const filteredSuggestions = allProductsAvailable.filter((product: Product) => product.name.toLowerCase().includes(query.toLowerCase()));
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (productName: string) => {
        setExtraFilters({ ...extraFilters, search: productName });
        setSuggestions([]);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const rawValue = e.target.value;

        if (rawValue === '') {
            setExtraFilters({ ...extraFilters, [key]: null });
            return;
        }

        const numberValue = parseInt(rawValue);

        if (isNaN(numberValue)) {
            setExtraFilters({ ...extraFilters, [key]: null });
            return;
        }

        setExtraFilters({
            ...extraFilters,
            [key]: Math.max(numberValue, 0),
        });
    };

    const FILTER_KEYS = ['brand', 'color', 'size', 'type', 'minPrice', 'maxPrice', 'sortBy', 'direction']; // 'stock'
    const sizes = {
        'Fit XS': 'Fit XS',
        'Fit S': 'Fit S',
        'Fit M': 'Fit M',
        'Fit L': 'Fit L',
        'Fit XL': 'Fit XL',
        'Fit XS-S': 'Fit XS-S',
        'Fit S-M': 'Fit S-M',
        'Fit M-L': 'Fit M-L',
        'Fit L-XL': 'Fit L-XL',
        'Fit XL-XXL': 'Fit XL-XXL',
    };

    const applyFilter = () => {
        const currentParams = new URLSearchParams(window.location.search);

        Object.entries(extraFilters || {}).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    currentParams.set(key, value.join(','));
                } else {
                    currentParams.delete(key);
                }
            } else if (value !== null && value !== undefined && value !== '') {
                currentParams.set(key, String(value));
            } else {
                currentParams.delete(key);
            }
        });

        currentParams.set('page', '1');

        const url = `${window.location.pathname}?${currentParams.toString()}`;

        router.get(
            url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilter = () => {
        const params = new URLSearchParams(window.location.search);

        FILTER_KEYS.forEach((key) => params.delete(key));

        setExtraFilters({ available: extraFilters?.available, search: extraFilters?.search });

        const cleanUrl = `${window.location.pathname}?${params.toString()}`;
        router.visit(cleanUrl, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const toggleAvailableOnly = (checked: boolean) => {
        const params = new URLSearchParams(window.location.search);

        if (checked) {
            params.set('available', 'true');
        } else {
            params.delete('available');
        }
        params.set('page', '1');

        router.visit(`${window.location.pathname}?${params.toString()}`, {
            method: 'get',
            preserveState: true,
            replace: true,
        });
    };

    const isFilterActive = !!(
        extraFilters?.brand ||
        (extraFilters?.size && extraFilters.size !== '') ||
        (extraFilters?.color && extraFilters.color.length > 0) ||
        (extraFilters?.type && extraFilters.type.length > 0) ||
        extraFilters?.minPrice != null ||
        extraFilters?.maxPrice != null ||
        extraFilters?.sortBy
    );

    const isAvailActive = !!(extraFilters?.available && extraFilters.available === true);

    const isSearchActive = !!(extraFilters?.search && extraFilters.search.trim() !== '');

    return (
        <div className="mt-10 flex items-center justify-center bg-[#FFFBF4] py-10">
            <div className="w-full px-5 md:max-w-2xl md:px-3">
                {/* control button */}
                <div className={`flex items-center justify-center gap-2`}>
                    <div
                        className={`${
                            isAvailActive ? 'animate-slow-pulse bg-[#A27163]' : 'bg-[#A27163]'
                        } cursor-pointer bg-[#A27163] px-3 py-1 text-white transition duration-300 hover:bg-[#8d5a4d]`}
                    >
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={extraFilters?.available || false}
                                onChange={(e) => {
                                    setExtraFilters({ ...extraFilters, available: e.target.checked });
                                    toggleAvailableOnly(e.target.checked);
                                }}
                                className="h-3 w-3 cursor-pointer appearance-none bg-white transition-all checked:border-white checked:bg-white checked:before:block checked:before:text-center checked:before:leading-4 checked:before:text-slate-800 checked:before:content-['✔']"
                            />
                            <label>Available Only</label>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowFilter((prev) => !prev)}
                        className={`cursor-pointer bg-[#A27163] px-3 py-1 text-white transition duration-300 hover:bg-[#8d5a4d] ${
                            isFilterActive ? 'animate-slow-pulse bg-[#A27163]' : 'bg-[#A27163]'
                        }`}
                    >
                        <span className="flex items-center justify-center gap-1 text-sm">
                            <Filter size={13} />
                            Filter
                        </span>
                    </button>

                    <button
                        onClick={() => setShowSearch((prev) => !prev)}
                        className={`${
                            isSearchActive ? 'animate-slow-pulse bg-[#A27163]' : 'bg-[#A27163]'
                        } cursor-pointer bg-[#A27163] px-3 py-1 text-white transition duration-300 hover:bg-[#8d5a4d]`}
                    >
                        <span className="flex items-center justify-center gap-1 text-sm">
                            <Search size={13} />
                            Search
                        </span>
                    </button>
                </div>

                {/* Search */}
                <div
                    className={`transition-all duration-500 ${showSearch ? 'pointer-events-auto my-4 max-h-20 opacity-100' : 'pointer-events-none max-h-0 opacity-0'}`}
                >
                    <div className="relative w-full" ref={searchContainerRef}>
                        <input
                            type="text"
                            placeholder="Cari produk"
                            value={extraFilters?.search || ''}
                            onChange={handleInputChange}
                            className={`${extraFilters?.search ? 'border-[#A27163]' : 'border-white'} w-full border-2 bg-white px-3 py-2 text-sm text-slate-800 transition-all duration-400 focus:border-[#A27163] focus:ring-1 focus:ring-[#A27163] focus:outline-none`}
                        />

                        {extraFilters?.search && (
                            <button
                                type="button"
                                // onClick={() => setExtraFilters({ ...extraFilters, search: '' })}
                                onClick={() => {
                                    setExtraFilters({ ...extraFilters, search: '' });
                                    setSuggestions([]);
                                }}
                                className="absolute top-1/2 right-14 -translate-y-1/2 cursor-pointer text-slate-700 transition hover:text-slate-800"
                            >
                                <X size={18} />
                            </button>
                        )}

                        <button
                            onClick={() => {
                                applyFilter();
                            }}
                            className={`absolute top-1.5 right-1.5 flex h-[25px] w-10 cursor-pointer items-center justify-center bg-[#A27163] text-sm text-white transition duration-300 hover:bg-[#8d5a4d]`}
                        >
                            <Search size={15} />
                        </button>

                        {suggestions && suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 z-[9999] mt-3 max-h-60 w-full overflow-y-auto border border-slate-300 bg-white shadow-sm">
                                {suggestions.map((product, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleSuggestionClick(product.name)}
                                        className="cursor-pointer px-4 py-2 text-sm text-slate-700 hover:bg-[#A27163] hover:text-white"
                                    >
                                        {product.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Filter panel */}
                <div
                    className={`grid grid-cols-3 gap-2 overflow-hidden transition-all duration-500 md:grid-cols-3 ${
                        showFilter ? 'my-4 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    {/* price mobile */}
                    <Input
                        type="number"
                        placeholder="Min. Price"
                        value={extraFilters?.minPrice != null ? Math.max(extraFilters.minPrice, 0) : ''}
                        onChange={(e) => setExtraFilters({ ...extraFilters, minPrice: e.target.value ? parseInt(e.target.value) : null })}
                        className={`${extraFilters?.minPrice || extraFilters?.minPrice == 0 ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#A27163] focus:ring-1 focus:ring-[#A27163] focus:outline-none md:hidden`}
                    />

                    <Input
                        type="number"
                        placeholder="Max. Price"
                        value={extraFilters?.maxPrice != null ? Math.max(extraFilters.maxPrice, 0) : ''}
                        onChange={(e) => setExtraFilters({ ...extraFilters, maxPrice: e.target.value ? parseInt(e.target.value) : null })}
                        className={`${extraFilters?.maxPrice || extraFilters?.maxPrice == 0 ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#A27163] focus:ring-1 focus:ring-[#A27163] focus:outline-none md:hidden`}
                    />

                    {/* price */}
                    <div className="hidden grid-cols-1 gap-2 md:grid md:grid-cols-2">
                        <Input
                            type="number"
                            placeholder="Min. Price"
                            value={extraFilters?.minPrice != null ? Math.max(extraFilters.minPrice, 0) : ''}
                            onChange={(e) => handlePriceChange(e, 'minPrice')}
                            className={`${extraFilters?.minPrice || extraFilters?.minPrice == 0 ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#A27163] focus:ring-1 focus:ring-[#A27163] focus:outline-none`}
                        />

                        <Input
                            type="number"
                            placeholder="Max. Price"
                            value={extraFilters?.maxPrice != null ? Math.max(extraFilters.maxPrice, 0) : ''}
                            onChange={(e) => handlePriceChange(e, 'maxPrice')}
                            className={`${extraFilters?.maxPrice || extraFilters?.maxPrice == 0 ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#A27163] focus:ring-1 focus:ring-[#A27163] focus:outline-none`}
                        />
                    </div>

                    {/* Brand */}
                    <BrandSelect
                        value={extraFilters?.brand ?? null}
                        onChange={(val) =>
                            setExtraFilters({
                                ...extraFilters,
                                brand: val,
                            })
                        }
                        brands={brands}
                        placeholder="All Brands"
                    />
                    {/* <select
                        value={extraFilters?.brand || ''}
                        onChange={(e) =>
                            setExtraFilters({
                                ...extraFilters,
                                brand: e.target.value ? parseInt(e.target.value) : null,
                            })
                        }
                        className={`${extraFilters?.brand ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#A27163] focus:ring-1 focus:ring-[#A27163] focus:outline-none`}
                    >
                        <option value="">All Brands</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select> */}

                    {/* Colors */}
                    <FilterWithChip
                        label="All Colour"
                        options={colors}
                        value={extraFilters?.color ?? []}
                        onChange={(val) => setExtraFilters((prev) => ({ ...prev, color: val as number[] }))}
                    />

                    {/* Types */}
                    <FilterWithChip
                        label="All Types"
                        options={types}
                        value={extraFilters?.type ?? []}
                        onChange={(val) => setExtraFilters((prev) => ({ ...prev, type: val as number[] }))}
                    />

                    {/* Sizes */}
                    <select
                        value={extraFilters?.size || ''}
                        onChange={(e) =>
                            setExtraFilters({
                                ...extraFilters,
                                size: e.target.value,
                            })
                        }
                        className={`${extraFilters?.size ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#A27163] focus:ring-1 focus:ring-[#A27163] focus:outline-none`}
                    >
                        <option value="">All Sizes</option>
                        {Object.entries(sizes).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>

                    {/* Sort*/}
                    <select
                        value={`${extraFilters?.sortBy || ''}:${extraFilters?.direction || ''}`}
                        onChange={(e) => {
                            const [sortBy, direction] = e.target.value.split(':');
                            setExtraFilters({
                                ...extraFilters,
                                sortBy,
                                direction: direction as any,
                            });
                        }}
                        className={`${extraFilters?.sortBy ? 'border-[#A27163]' : 'border-white'} scrollbar-hide w-full overflow-x-auto rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#A27163] focus:ring-1 focus:ring-[#A27163] focus:outline-none`}
                    >
                        <option value="">Sort By</option>
                        <option value="price_after_discount:asc">Price: Low-High</option>
                        <option value="price_after_discount:desc">Price: High-Low</option>
                        <option value="name:asc">Name: A-Z</option>
                        <option value="stock:2">Stock: 2 Pcs (Available Only)</option>
                    </select>

                    <div className={`col-span-full mt-3 flex w-full items-center justify-center gap-2 transition-all duration-500`}>
                        <button
                            onClick={applyFilter}
                            className="w-full cursor-pointer bg-[#A27163] px-3 py-2 text-white transition duration-300 hover:bg-[#905e51]"
                        >
                            Apply
                        </button>
                        <button
                            onClick={clearFilter}
                            className="w-full cursor-pointer bg-[#bc8f83] px-3 py-2 text-white transition duration-300 hover:bg-[#c19386]"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;

{
    /* Stock (blocked) */
}
{
    /* <select
                        value={extraFilters?.stock || ''}
                        onChange={(e) =>
                            setExtraFilters({
                                ...extraFilters,
                                stock: e.target.value ? parseInt(e.target.value) : null,
                            })
                        }
                        className={`${extraFilters?.stock ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
                    >
                        <option value="">All Stock</option>
                        <option value="1">1 Pcs++ (Available Only)</option>
                        <option value="2">2 Pcs++ (Available Only)</option>
                        <option value="3">3 Pcs++ (Available Only)</option>
                        <option value="4">4 Pcs++ (Available Only)</option>
                        <option value="5">5 Pcs++ (Available Only)</option>
                    </select> */
}

{
    /* old Sort*/
}
// <select
//     value={`${extraFilters?.sortBy || ''}:${extraFilters?.direction || ''}`}
//     onChange={(e) => {
//         const [sortBy, direction] = e.target.value.split(':');
//         setExtraFilters({
//             ...extraFilters,
//             sortBy,
//             direction: direction as 'asc' | 'desc',
//         });
//     }}
//     className={`${extraFilters?.sortBy ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
// >
//     <option value="">Sort By</option>
//     <option value="price_after_discount:asc">Price: Low-High</option>
//     <option value="price_after_discount:desc">Price: High-Low</option>
//     <option value="name:asc">Name: A-Z</option>
//     <option value="stock:2">Stock: 2 Pcs ++ (Available Only)</option>
//     <option value="name:desc">Name: Z-A</option>
//     <option value="upload_at:desc">Newest First</option>
//     <option value="upload_at:asc">Oldest First</option>
// </select>
