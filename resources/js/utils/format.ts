export const formatRupiah = (value: number | null | undefined): string => {
    if (!value) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export const formatWhatsAppNumber = (number: string): string => {
    if (!number) return '628877935678';
    let value = number.trim();

    if (value.startsWith('08')) {
        value = '62' + value.slice(1);
    } else if (value.startsWith('8')) {
        value = '62' + value;
    } else if (value.startsWith('+62')) {
        value = '62' + value.slice(3);
    }

    return value;
};
