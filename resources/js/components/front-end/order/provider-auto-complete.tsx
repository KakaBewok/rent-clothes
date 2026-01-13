import { useState } from 'react';

const PROVIDER_OPTIONS = [
    'BCA',
    'Mandiri',
    'BNI',
    'BRI',
    'CIMB Niaga',
    'Permata',
    'Danamon',
    'Gopay',
    'OVO',
    'DANA',
    'ShopeePay',
    'Bank Jago',
    'Bank BJB',
    'Bank Mega',
    'BSI',
    'Bank ANZ Indonesia',
    'Bank Muamalat',
    'Citibank Indonesia',
    'HSBC Indonesia',
    'Maybank Indonesia',
    'OCBC NISP',
    'Panin Bank',
    'UOB Indonesia',
    'SeaBank',
    'Jenius',
    'LinkAja',
    'Commonwealth Bank Indonesia',
    'Sinarmas Bank',
    'Blu',
    'Allo Bank',
    'Neo Commerce Bank',
    'Bank Banten',
    'Bank BSG',
    'Bank Bengkulu',
    'Bank BJB Syariah',
    'Bank BPD Bali',
    'Bank Aceh',
];

type ProviderAutocompleteProps = {
    value?: string;
    onChange: (value: string) => void;
    error?: string;
};

function ProviderAutocomplete({ value, onChange, error }: ProviderAutocompleteProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const filteredProviders = PROVIDER_OPTIONS.filter((prov) => prov.toLowerCase().includes((value ?? '').toLowerCase()));

    return (
        <div className="relative">
            <input
                type="text"
                value={value ?? ''}
                placeholder="Ketik bank/provider"
                className="w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                autoComplete="off"
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 100)}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
            />

            {isOpen && filteredProviders.length > 0 && (
                <ul className="absolute z-10 mt-2 max-h-48 w-full overflow-auto border border-slate-300 bg-white text-sm shadow">
                    {filteredProviders.map((prov) => (
                        <li
                            key={prov}
                            className="cursor-pointer px-3 py-2 hover:bg-slate-100"
                            onMouseDown={() => {
                                onChange(prov);
                                setIsOpen(false);
                            }}
                        >
                            {prov.toUpperCase()}
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}

export default ProviderAutocomplete;
