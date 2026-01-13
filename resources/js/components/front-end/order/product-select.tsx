import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Product } from '@/types/models';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

interface ProductSelectProps {
    value?: number;
    onChange: (value: number | undefined) => void;
    availableProducts: Product[];
    loading?: boolean;
    placeholder?: string;
    label?: string;
}

export function ProductSelect({
    value,
    onChange,
    availableProducts,
    loading = false,
    placeholder = 'Pilih Produk',
    label = 'Produk',
}: ProductSelectProps) {
    const [open, setOpen] = React.useState<boolean>(false);

    const selectedProduct = availableProducts.find((p) => p.id === value);

    return (
        <div className="w-full space-y-1">
            <FieldLabel className="text-md font-semibold text-slate-700">
                {label} <span className="text-red-500">*</span>
            </FieldLabel>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="mt-2 w-full justify-between overflow-x-auto rounded-none !border !border-slate-300 !bg-white shadow-none hover:!border-slate-300 hover:!bg-white hover:!text-inherit focus-visible:!ring-0 active:!bg-white dark:hover:!bg-white dark:hover:!text-slate-700"
                    >
                        {selectedProduct ? (
                            <span>
                                {selectedProduct.name} - {selectedProduct.brand?.name} ({selectedProduct.code ?? '-'})
                            </span>
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="mt-1 w-[var(--radix-popover-trigger-width)] rounded-none p-0 shadow-none">
                    <Command>
                        <CommandInput placeholder="Cari produk..." />
                        <CommandList>
                            <CommandEmpty>{loading ? 'Memuat produk...' : 'Tidak ada produk tersedia'}</CommandEmpty>

                            {!loading && availableProducts.length > 0 && (
                                <CommandGroup>
                                    {availableProducts.map((p) => (
                                        <CommandItem
                                            key={p.id}
                                            value={p.name}
                                            onSelect={() => {
                                                onChange(p.id);
                                                setOpen(false);
                                            }}
                                            className="flex items-center gap-3 py-2"
                                        >
                                            {/* cover image */}
                                            <img
                                                src={`/storage/${p.cover_image}`}
                                                alt={p.name}
                                                className="h-27 w-15 rounded-none border border-slate-100 object-cover"
                                            />

                                            {/* Info */}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{p.code ?? '-'}</span>
                                                <span className="text-xs text-slate-800 dark:text-white">{p.brand?.name ?? '-'}</span>
                                            </div>

                                            {/* Check Icon */}
                                            <Check
                                                className={cn(
                                                    'ml-auto h-4 w-4 text-primary dark:text-white',
                                                    value === p.id ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
