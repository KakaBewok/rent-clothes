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
        <div className="my-9 flex justify-center px-4">
            <div className="w-full overflow-hidden rounded-3xl border-4 border-[#D8CFBC] md:max-w-lg lg:max-w-xl">
                <div className="h-10 w-full bg-[#D8CFBC]"></div>

                <div className="bg-white p-4 text-center text-xs text-black md:px-6 md:py-6 lg:text-sm">
                    Menampilkan dress yang dapat dikirim pada <strong>{formatDate(shipDate)}</strong> dipakai pada{' '}
                    <strong>{formatDate(useDate)}</strong> dan perlu dikembalikan pada <strong>{formatDate(returnDate)}</strong> dengan pengiriman
                    dari area <strong>{branchName}</strong>
                </div>
            </div>
        </div>
        // old
        // <div className="my-9 px-4">
        //     <Alert className="rounded-sm border border-white bg-[#D8CFBC] text-slate-700">
        //         <AlertTitle>Note:</AlertTitle>
        //         <AlertDescription className="text-xs md:text-sm">
        //             Menampilkan dress yang dapat dikirim pada <strong>{formatDate(shipDate)}</strong> dipakai pada{' '}
        //             <strong>{formatDate(useDate)}</strong> dan perlu dikembalikan pada <strong>{formatDate(returnDate)}</strong> dengan pengiriman
        //             dari area <strong>{branchName}</strong>
        //         </AlertDescription>
        //     </Alert>
        // </div>
    );
};

export default NoteBox;
