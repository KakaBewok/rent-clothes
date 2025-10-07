import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Color, Type } from '@/types/models';
import * as React from 'react';

interface FilterWithChipProps {
    label: string;
    options: Color[] | Type[];
    value: number[];
    onChange: (val: (string | number)[]) => void;
}

export default function FilterWithChip({ label, options, value, onChange }: FilterWithChipProps) {
    const [tempValue, setTempValue] = React.useState<(string | number)[]>(value);

    // React.useEffect(() => {
    //     setTempValue(value ?? []);
    // }, [value]);

    const toggleOption = (id: string | number) => {
        setTempValue((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
    };

    const applyFilter = () => {
        onChange(tempValue);
    };

    // const removeChip = (id: string | number) => {
    //     const newValue = value.filter((v) => v !== id);
    //     onChange(newValue);
    // };

    return (
        <div className="">
            {/* Trigger Button */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className={`${tempValue.length > 0 ? 'border-2 !border-[#A27163]' : 'border-none'} w-full cursor-pointer justify-start rounded-none !bg-white text-sm text-slate-800 shadow-none hover:text-slate-800 md:mx-0`}
                    >
                        {label}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[300px] !rounded-none md:max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Choose {label}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-50 space-y-2 overflow-y-auto">
                        {options.map((opt, i) => (
                            <label key={i} className="flex cursor-pointer items-center gap-2">
                                <Checkbox checked={tempValue.includes(opt.id)} onCheckedChange={() => toggleOption(opt.id)} />
                                <span>{opt.name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-1 flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={() => setTempValue(value)} className="rounded-none">
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={applyFilter} className="rounded-none">
                                Done
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Chips */}
            {/* <div className="flex flex-wrap gap-2">
                {value.map((val) => {
                    const opt = options.find((o) => o.id === val);
                    return (
                        <span key={val} className="flex items-center gap-1 rounded-full bg-[#e5d5d0] px-3 py-1 text-sm text-[#3d2c28]">
                            {opt?.name}
                            <button onClick={() => removeChip(val)} className="ml-1 text-xs hover:text-red-500">
                                <X size={14} />
                            </button>
                        </span>
                    );
                })}
            </div> */}
        </div>
    );
}
