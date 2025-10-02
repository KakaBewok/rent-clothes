import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PaginationMeta } from '@/types/models';
import React, { useMemo } from 'react';

const PaginationView = ({ meta }: { meta: PaginationMeta }) => {
    const currentParams = useMemo(() => {
        return new URLSearchParams(window.location.search);
    }, []);

    const buildUrl = (page: number) => {
        const params = new URLSearchParams(currentParams);
        params.set('page', String(page));
        return `?${params.toString()}`;
    };

    return (
        <div className="mt-10 flex justify-center">
            <Pagination>
                <PaginationContent className="flex items-center gap-2">
                    {/* Previous */}
                    {meta.current_page > 1 && (
                        <PaginationItem>
                            <PaginationPrevious
                                href={buildUrl(meta.current_page - 1)}
                                className="w-full rounded-none border-none px-3 py-2 text-xs"
                                size={undefined}
                            />
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
                                        <PaginationLink
                                            href={buildUrl(page)}
                                            isActive={meta.current_page === page}
                                            className={`w-full rounded-none border-none px-3 py-2 text-xs`}
                                            size={undefined}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                </React.Fragment>
                            );
                        })}

                    {/* Next */}
                    {meta.current_page < meta.last_page && (
                        <PaginationItem>
                            <PaginationNext
                                href={buildUrl(meta.current_page + 1)}
                                className="w-full rounded-none border-none px-3 py-2 text-xs"
                                size={undefined}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationView;
