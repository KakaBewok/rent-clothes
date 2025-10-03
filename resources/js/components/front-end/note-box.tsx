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
        <div className="my-9 flex w-full justify-center px-6">
            <div className="relative inline-block w-full md:max-w-lg lg:max-w-xl">
                {/* shadow effect */}
                <div className="absolute top-1 left-1 h-full w-full rounded-2xl bg-[#D8CFBC] md:top-2 md:left-2"></div>

                <div className="font-lora relative rounded-2xl border border-[#D8CFBC] bg-white px-6 py-5 text-center text-sm leading-relaxed text-gray-700 md:text-base">
                    Menampilkan dress yang dapat dikirim pada <span className="font-semibold">{formatDate(shipDate)}</span> dipakai pada{' '}
                    <span className="font-semibold">{formatDate(useDate)}</span> dan perlu dikembalikan pada{' '}
                    <span className="font-semibold">{formatDate(returnDate)}</span> dengan pengiriman dari area{' '}
                    <span className="font-semibold">{branchName}</span>
                </div>
            </div>
        </div>
    );
};

export default NoteBox;
