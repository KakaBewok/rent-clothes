import { formatWhatsAppNumber } from '@/utils/format';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsapp = ({ whatsapp_number }: { whatsapp_number: string | null | undefined }) => {
    const message = 'Hai Kak! Aku mau sewa dress nih. Boleh dibantu proses selanjutnya? Terima kasih.';
    return (
        <a
            href={`https://wa.me/${formatWhatsAppNumber(whatsapp_number ?? '628877935678')}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-4 bottom-4 flex cursor-pointer items-center justify-center rounded-full bg-green-500 p-2 text-white shadow-lg transition duration-300 hover:bg-green-600 motion-safe:animate-bounce md:p-3"
        >
            <FaWhatsapp className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10" />
        </a>
    );
};

export default FloatingWhatsapp;
