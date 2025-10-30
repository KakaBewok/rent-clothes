'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Brand } from '@/types/models';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

interface BrandSelectProps {
    value?: number | null;
    onChange: (value: number | null) => void;
    brands: Brand[];
    placeholder?: string;
}

export function BrandSelect({ value, onChange, brands, placeholder = 'Choose Brand' }: BrandSelectProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    const selected = brands.find((b) => b.id === value);

    return (
        <div className="w-full cursor-pointer space-y-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            'scrollbar-hide w-full cursor-pointer justify-between overflow-x-auto rounded-none border-2 px-2 py-2 text-sm text-slate-700 shadow-none hover:bg-white dark:bg-white dark:hover:bg-white dark:hover:text-slate-700',
                            value ? 'border-[#A27163] dark:border-[#A27163]' : 'border-white bg-white dark:border-white',
                        )}
                    >
                        {selected ? <span>{selected.name}</span> : <span className="text-slate-700">{placeholder}</span>}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="mt-1 mr-3 w-sm max-w-[80vw] rounded-none p-0 shadow-none md:w-[var(--radix-popover-trigger-width)]">
                    <Command>
                        <CommandInput placeholder="Cari..." />
                        <CommandList>
                            <CommandEmpty>Brand not found</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    key={0}
                                    value="all"
                                    onSelect={() => {
                                        onChange(null);
                                        setOpen(false);
                                    }}
                                >
                                    All Brands
                                </CommandItem>
                                {brands.map((b) => (
                                    <CommandItem
                                        key={b.id}
                                        value={b.name}
                                        onSelect={() => {
                                            onChange(b.id === value ? null : b.id);
                                            setOpen(false);
                                        }}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <span className="text-sm">{b.name}</span>
                                        <Check className={cn('h-4 w-4 text-primary', value === b.id ? 'opacity-100' : 'opacity-0')} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
