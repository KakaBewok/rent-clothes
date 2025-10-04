import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PaginationMeta } from '@/types/models';
import { Link } from '@inertiajs/react';
import React from 'react';

const PaginationView = ({ meta }: { meta: PaginationMeta }) => {
    const buildUrl = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', String(page));
        return `${window.location.pathname}?${params.toString()}`;
    };

    return (
        <div className="mt-10 flex justify-center">
            <Pagination>
                <PaginationContent className="flex items-center gap-2">
                    {/* Previous */}
                    {meta.current_page > 1 && (
                        <PaginationItem>
                            <Link href={buildUrl(meta.current_page - 1)} preserveState>
                                <PaginationPrevious
                                    size={undefined}
                                    className="w-full rounded-none border-none bg-[#A27163] px-3 py-2 text-xs text-white hover:bg-[#8d5f54]"
                                />
                            </Link>
                        </PaginationItem>
                    )}

                    {/* Numbers */}
                    {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                        .filter((page) => page === 1 || page === meta.last_page || (page >= meta.current_page - 2 && page <= meta.current_page + 2))
                        .map((page, idx, arr) => {
                            const prev = arr[idx - 1];
                            const isEllipsis = prev && page - prev > 1;

                            return (
                                <React.Fragment key={page}>
                                    {isEllipsis && <span className="px-2 text-slate-700">...</span>}
                                    <PaginationItem>
                                        <Link
                                            href={buildUrl(page)}
                                            preserveState
                                            className={`${meta.current_page === page && 'pointer-events-none'}`}
                                        >
                                            <PaginationLink
                                                isActive={meta.current_page === page}
                                                size={undefined}
                                                className={`w-full rounded-none border-none bg-[#A27163] px-3 py-2 text-xs text-white hover:bg-[#8d5f54] md:text-sm ${
                                                    meta.current_page === page
                                                        ? 'pointer-events-none bg-[#A27163] text-white opacity-70'
                                                        : 'bg-[#A27163] text-white hover:bg-[#8d5f54]'
                                                }`}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </Link>
                                    </PaginationItem>
                                </React.Fragment>
                            );
                        })}

                    {/* Next */}
                    {meta.current_page < meta.last_page && (
                        <PaginationItem>
                            <Link href={buildUrl(meta.current_page + 1)} preserveState>
                                <PaginationNext
                                    size={undefined}
                                    className="w-full rounded-none border-none bg-[#A27163] px-3 py-2 text-xs text-white hover:bg-[#8d5f54]"
                                />
                            </Link>
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationView;
