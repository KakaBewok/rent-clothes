import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Branch, Filter } from '@/types/models';
import { addDays, format, isValid, parse, subDays } from 'date-fns';
import { id } from 'date-fns/locale';

const NoteBox = ({ branchs }: { branchs: Branch[] }) => {
    const params = new URLSearchParams(window.location.search);

    const filter: Filter = {
        useByDate: params.get('useByDate') || '',
        duration: Number(params.get('duration') || 0),
        city: params.get('city') || '',
        shippingType: params.get('shippingType') || 'Next day',
    };

    const parsed = parse(filter.useByDate, 'dd-MM-yyyy', new Date());
    const useDate = isValid(parsed) ? parsed : new Date();
    const shipDate = filter.shippingType === 'Next day' ? subDays(useDate, 2) : subDays(useDate, 1);
    const returnDate = addDays(useDate, filter.duration);

    const formatDate = (date: Date) => format(date, 'dd MMMM yyyy', { locale: id });

    const branchName = branchs.find((b) => b.id.toString() === filter.city)?.name || 'Bandung';

    return (
        <div className="my-9 px-4">
            <Alert className="rounded-sm border border-[#C9B7B4] bg-[#E5D7D5] text-slate-700">
                <AlertTitle>Note:</AlertTitle>
                <AlertDescription className="text-xs md:text-sm">
                    Menampilkan dress yang dapat dikirim pada <strong>{formatDate(shipDate)}</strong> dipakai pada{' '}
                    <strong>{formatDate(useDate)}</strong> dan perlu dikembalikan pada <strong>{formatDate(returnDate)}</strong> dengan pengiriman
                    dari area <strong>{branchName}</strong>
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default NoteBox;
