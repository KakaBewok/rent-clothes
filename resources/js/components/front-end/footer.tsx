import { AppSetting } from '@/types/models';
import { formatWhatsAppNumber } from '@/utils/format';
import { Instagram, Mail, MapPin, MessageCircle, ShoppingBag } from 'lucide-react';
import AppLogo from './app-logo';
import InstallPwaButton from './install-pwa-button';

interface FooterProps {
    setting: AppSetting;
    setModalInfo: (param: string[] | null) => void;
    setShowScheduleModal: (param: boolean) => void;
}

const Footer = ({ setting, setModalInfo, setShowScheduleModal }: FooterProps) => {
    const { address, description, instagram, app_name, whatsapp_number, email, instruction_image, tnc_image } = setting;
    const message = 'Hai Kak! Aku mau sewa dress. Boleh dibantu proses selanjutnya? Terima kasih.';

    return (
        <footer className="mt-24 bg-white py-4 text-slate-700">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                    {/* general info */}
                    <div className="">
                        <AppLogo setting={setting} logoSize={160} />
                        <p className="my-3 text-left text-xs text-slate-400 md:my-5 md:text-sm">
                            {description ??
                                'Koleksi pakaian eksklusif untuk setiap acara. Nikmati pengalaman sewa yang nyaman, cepat, dan berkualitas tinggi.'}
                        </p>
                        <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-first md:h-5 md:w-5" />
                            <span className="text-xs text-slate-400 md:text-sm">{address ?? 'Bandung, Indonesia'}</span>
                        </div>
                    </div>

                    {/* service info */}
                    <div className="pl-0 md:pl-11">
                        <h4 className="md:text-md mb-2 text-sm font-semibold md:mb-3">Informasi</h4>
                        <ul className="space-y-1 text-xs md:text-sm">
                            <li>
                                <button
                                    onClick={() => {
                                        setShowScheduleModal(true);
                                    }}
                                    className="cursor-pointer text-slate-400 transition duration-300 hover:text-first"
                                >
                                    Cek Jadwal
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalInfo(instruction_image ?? null)}
                                    className="cursor-pointer text-slate-400 transition duration-300 hover:text-first"
                                >
                                    Cara Pemesanan
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalInfo(tnc_image ?? null)}
                                    className="cursor-pointer text-slate-400 transition duration-300 hover:text-first"
                                >
                                    Syarat & Ketentuan
                                </button>
                            </li>
                            <li>
                                <InstallPwaButton />
                            </li>
                            <li>
                                <a
                                    href={`/form`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer text-slate-400 transition duration-300 hover:text-first"
                                >
                                    <ShoppingBag className="-mt-1 mr-0.5 inline-block h-4 w-4" /> Form Order
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* medsos */}
                    <div>
                        <h4 className="md:text-md mb-2 text-sm font-semibold md:mb-3">Media Sosial</h4>
                        <ul className="space-y-1">
                            <li>
                                <a
                                    href={`https://www.instagram.com/${instagram ?? 'fayafairuz'}`}
                                    target="_blank"
                                    className="flex items-center text-xs text-slate-400 transition duration-300 hover:text-first md:text-sm"
                                >
                                    <Instagram className="mr-1 inline h-4 w-4 text-first" />
                                    {instagram ?? 'fayafairuz'}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* kontak */}
                    <div>
                        <h4 className="md:text-md mb-2 text-sm font-semibold md:mb-3">Kontak</h4>
                        <div className="space-y-1 md:space-y-2">
                            <div className="flex items-center space-x-1">
                                <MessageCircle className="h-4 w-4 text-first" />
                                <a
                                    href={`https://wa.me/${formatWhatsAppNumber(whatsapp_number ?? '08877935678')}?text=${encodeURIComponent(message)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="text-xs text-slate-400 transition duration-300 hover:text-first md:text-sm">
                                        {whatsapp_number?.trim() ?? '08877935678'}
                                    </span>
                                </a>
                            </div>
                            {email && (
                                <div className="flex items-center space-x-1">
                                    <Mail className="h-4 w-4 text-first" />
                                    <span className="text-xs text-slate-400 md:text-sm">{email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-xs font-normal text-slate-400">&copy; 2025 {app_name ?? 'Qatiarent'}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
