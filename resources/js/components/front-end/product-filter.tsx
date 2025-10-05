/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Brand, Color, ExtraFilter, Type } from '@/types/models';
import { router } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

// interface ProductFilterProps {
//     brands: Brand[];
//     colors: Color[];
//     types: Type[];
// }

// const ProductFilter = ({ brands, colors, types }: ProductFilterProps) => {
//     const [extraFilters, setExtraFilters] = useState<ExtraFilter>({});

//     const buildUrl = () => {
//         const params = new URLSearchParams(window.location.search);
//         return `${window.location.pathname}?${params.toString()}`;
//     };

//     const applyFilter = () => {
//         router.visit(buildUrl(), {
//             method: 'get',
//             data: { filters: extraFilters as Record<string, any> },
//             preserveState: true,
//             replace: true,
//         });
//     };

//     return (
//         <div className="mt-10 space-y-2 bg-amber-300">
//             <input
//                 type="text"
//                 placeholder="Cari Produk"
//                 value={extraFilters.search || ''}
//                 onChange={(e) => setExtraFilters({ ...extraFilters, search: e.target.value })}
//             />

//             <select value={extraFilters.brand || ''} onChange={(e) => setExtraFilters({ ...extraFilters, brand: parseInt(e.target.value) || null })}>
//                 <option value="">Semua Brand</option>
//                 <option value="1">Brand A</option>
//                 <option value="2">Brand B</option>
//             </select>

//             <select value={extraFilters.sortBy || ''} onChange={(e) => setExtraFilters({ ...extraFilters, sortBy: e.target.value })}>
//                 <option value="">Default</option>
//                 <option value="price">Harga</option>
//                 <option value="name">Nama</option>
//             </select>

//             <button onClick={applyFilter} className="rounded bg-blue-500 px-4 py-2 text-white">
//                 Terapkan Filter
//             </button>
//         </div>
//     );
// };

// export default ProductFilter;

interface ProductFilterProps {
    brands: Brand[];
    colors: Color[];
    types: Type[];
}

const ProductFilter = ({ brands, colors, types }: ProductFilterProps) => {
    const [extraFilters, setExtraFilters] = useState<ExtraFilter>({});
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);

    const sizes = {
        'Fit XS': 'Fit XS',
        'Fit S': 'Fit S',
        'Fit M': 'Fit M',
        'Fit L': 'Fit L',
        'Fit XL': 'Fit XL',
        'Fit XXL': 'Fit XXL',
        'Fit XS-S': 'Fit XS-S',
        'Fit S-M': 'Fit S-M',
        'Fit M-L': 'Fit M-L',
        'Fit L-XL': 'Fit L-XL',
        'Fit XL-XXL': 'Fit XL-XXL',
        'Fit XXL-XXXL': 'Fit XXL-XXXL',
    };

    const applyFilter = () => {
        // router.visit(buildUrl(), {
        //     method: 'post',
        //     data: { filters: extraFilters as Record<string, any> },
        //     preserveState: true,
        //     replace: true,
        // });
        const params = new URLSearchParams(window.location.search);
        Object.entries(extraFilters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });
        params.set('page', '1');

        router.visit(`${window.location.pathname}?${params.toString()}`, {
            method: 'get',
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
    return (
        <div className="mt-10 flex items-center justify-center bg-[#FFFBF4] py-10">
            <div className="w-full px-3 md:max-w-2xl">
                {/* control button */}
                <div className={`flex items-center justify-center gap-2`}>
                    <div className="cursor-pointer bg-[#A27163] px-3 py-1 text-white transition duration-300 hover:bg-[#8d5a4d]">
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={extraFilters.available || false}
                                onChange={(e) => {
                                    setExtraFilters({ ...extraFilters, available: e.target.checked });
                                    toggleAvailableOnly(e.target.checked);
                                }}
                            />
                            <label>Available Only</label>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowFilter((prev) => !prev)}
                        className="cursor-pointer bg-[#A27163] px-3 py-1 text-white transition duration-300 hover:bg-[#8d5a4d]"
                    >
                        <span className="flex items-center justify-center gap-1 text-sm">
                            <Filter size={13} />
                            Filter
                        </span>
                    </button>

                    <button
                        onClick={() => setShowSearch((prev) => !prev)}
                        className="cursor-pointer bg-[#A27163] px-3 py-1 text-white transition duration-300 hover:bg-[#8d5a4d]"
                    >
                        <span className="flex items-center justify-center gap-1 text-sm">
                            <Search size={13} />
                            Search
                        </span>
                    </button>
                </div>

                {/* Search */}
                <div className={`overflow-hidden transition-all duration-500 ${showSearch ? 'my-4 max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Cari produk"
                            value={extraFilters.search || ''}
                            onChange={(e) => setExtraFilters({ ...extraFilters, search: e.target.value })}
                            className={`${extraFilters.search ? 'border-[#A27163]' : 'border-white'} w-full border-2 bg-white px-3 py-2 text-sm text-slate-800 transition-all duration-400 focus:border-[#484f8f] focus:ring-2 focus:ring-[#484f8f]`}
                        />
                        <button
                            onClick={() => {
                                applyFilter();
                                // setExtraFilters({ ...extraFilters, search: '' });
                            }}
                            className={`absolute top-1.5 right-1.5 flex h-[25px] w-10 cursor-pointer items-center justify-center bg-[#A27163] text-sm text-white transition duration-300 hover:bg-[#8d5a4d]`}
                        >
                            <Search size={15} />
                        </button>
                    </div>
                </div>

                {/* Filter panel */}
                <div
                    className={`grid grid-cols-1 gap-2 overflow-hidden transition-all duration-500 md:grid-cols-3 ${
                        showFilter ? 'my-4 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    {/* price */}
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <Input
                            type="number"
                            placeholder="Min. Price"
                            value={extraFilters.minPrice ?? ''}
                            onChange={(e) => setExtraFilters({ ...extraFilters, minPrice: e.target.value ? parseInt(e.target.value) : null })}
                            className={`${extraFilters.minPrice ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
                        />

                        <Input
                            type="number"
                            placeholder="Max. Price"
                            value={extraFilters.maxPrice ?? ''}
                            onChange={(e) => setExtraFilters({ ...extraFilters, maxPrice: e.target.value ? parseInt(e.target.value) : null })}
                            className={`${extraFilters.maxPrice ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
                        />
                    </div>

                    {/* Brand */}
                    <select
                        value={extraFilters.brand || ''}
                        onChange={(e) =>
                            setExtraFilters({
                                ...extraFilters,
                                brand: parseInt(e.target.value) || null,
                            })
                        }
                        className={`${extraFilters.brand ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
                    >
                        <option value="">All Brands</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>

                    {/* Colors */}
                    <select
                        value={extraFilters.color || ''}
                        onChange={(e) =>
                            setExtraFilters({
                                ...extraFilters,
                                color: parseInt(e.target.value) || null,
                            })
                        }
                        className={`${extraFilters.color ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
                    >
                        <option value="">All Colors</option>
                        {colors.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Types */}
                    <select
                        value={extraFilters.type || ''}
                        onChange={(e) =>
                            setExtraFilters({
                                ...extraFilters,
                                type: parseInt(e.target.value) || null,
                            })
                        }
                        className={`${extraFilters.type ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
                    >
                        <option value="">All Types</option>
                        {types.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    {/* Sizes */}
                    <select
                        value={extraFilters.size || ''}
                        onChange={(e) =>
                            setExtraFilters({
                                ...extraFilters,
                                size: e.target.value || null,
                            })
                        }
                        className={`${extraFilters.size ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
                    >
                        <option value="">All Sizes</option>
                        {Object.entries(sizes).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>

                    {/* Sort - masalah di paging (sampe sini)*/}
                    <select
                        value={`${extraFilters.sortBy || ''}:${extraFilters.direction || ''}`}
                        onChange={(e) => {
                            const [sortBy, direction] = e.target.value.split(':');
                            setExtraFilters({ ...extraFilters, sortBy, direction: direction as 'asc' | 'desc' });
                        }}
                        className={`${extraFilters.sortBy ? 'border-[#A27163]' : 'border-white'} w-full rounded-none border-2 bg-white px-2 py-2 text-sm text-slate-800 shadow-none transition-all duration-400 focus:border-[#484f8f] focus:ring-1 focus:ring-[#484f8f]`}
                    >
                        <option value="upload_at:desc">Sort By</option>
                        <option value="price_after_discount:asc">Price: Low-High</option>
                        <option value="price_after_discount:desc">Price: High-Low</option>
                        <option value="name:asc">Name: A-Z</option>
                        <option value="name:desc">Name: Z-A</option>
                        <option value="upload_at:desc">Newest First</option>
                        <option value="upload_at:asc">Oldest First</option>
                    </select>
                </div>

                {showFilter && (
                    <div className="flex w-full items-center justify-center gap-2">
                        <button
                            onClick={applyFilter}
                            className="w-full cursor-pointer bg-[#A27163] px-3 py-2 text-white transition duration-300 hover:bg-[#905e51]"
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => setExtraFilters({})}
                            className="w-full cursor-pointer bg-[#bc8f83] px-3 py-2 text-white transition duration-300 hover:bg-[#c19386]"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductFilter;
