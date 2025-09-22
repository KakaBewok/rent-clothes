import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// dummy note box
const NoteBox = () => {
    return (
        <div className="my-9 px-4">
            <Alert className="border-1 border-second bg-third text-slate-700">
                <AlertTitle>Note:</AlertTitle>
                <AlertDescription className="text-xs md:text-sm">
                    Menampilkan dress yang dapat dikirim pada <strong>21 September 2025</strong> dipakai pada <strong>22 September 2025</strong> dan
                    perlu dikembalikan pada <strong>23 September 2025</strong> dengan pengiriman dari area <strong>Tangerang Selatan</strong>
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default NoteBox;
