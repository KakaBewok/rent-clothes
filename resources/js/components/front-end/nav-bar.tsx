import { AppSetting } from '@/types/models';
import { formatWhatsAppNumber } from '@/utils/format';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '../front-end/app-logo';

interface navBarProps {
    setting: AppSetting;
    setModalInfo: (param: string[] | null) => void;
    setShowScheduleModal: (param: boolean) => void;
}

const NavBar = ({ setting, setModalInfo, setShowScheduleModal }: navBarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const { tnc_image, instruction_image, whatsapp_number } = setting;

    const message = 'Hai Kak! Aku mau sewa dress nih. Boleh dibantu proses selanjutnya? Terima kasih.';

    return (
        <nav className="sticky top-0 z-40 bg-white">
            {/* <div className="mx-auto flex h-fit w-full items-center px-4 py-2"> */}
            <div className="mx-auto flex h-fit w-full items-center justify-between px-4 py-2">
                <div className="hidden md:flex">
                    <AppLogo setting={setting} logoSize={127} />
                </div>

                {/* mobile menu button */}
                <div className="cursor-pointer md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative flex h-6 w-6 items-center justify-center text-gray-700">
                        <Menu
                            className={`absolute h-6 w-6 transform transition-all duration-300 ${
                                isMenuOpen ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
                            }`}
                        />
                        <X
                            className={`absolute h-6 w-6 transform transition-all duration-300 ${
                                isMenuOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
                            }`}
                        />
                    </button>
                </div>

                {/* nav: tablet & desktop */}
                <div className="mx-auto hidden space-x-8 md:flex">
                    <button
                        onClick={() => {
                            setShowScheduleModal(true);
                        }}
                        className="cursor-pointer text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first"
                    >
                        Cek Jadwal
                    </button>

                    <button
                        onClick={() => setModalInfo(instruction_image ?? null)}
                        className="cursor-pointer text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first"
                    >
                        Cara Pemesanan
                    </button>
                    <button
                        onClick={() => setModalInfo(tnc_image ?? null)}
                        className="cursor-pointer text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first"
                    >
                        Syarat & Ketentuan
                    </button>
                    <a
                        href={`https://wa.me/${formatWhatsAppNumber(whatsapp_number ?? '628877935678')}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first"
                    >
                        Kontak
                    </a>
                </div>

                <div className="hidden md:flex">
                    <a
                        href={`/form`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first"
                    >
                        <ShoppingBag className="-mt-1 inline-block h-6 w-6" />
                    </a>
                </div>

                <div className="ml-auto block md:hidden">
                    <AppLogo setting={setting} logoSize={100} />
                </div>
            </div>

            {/* nav: mobile */}
            <div
                className={`transform transition-all duration-300 ease-in-out md:hidden ${
                    isMenuOpen ? 'max-h-96 scale-100 opacity-100' : 'max-h-0 scale-95 opacity-0'
                } overflow-hidden`}
            >
                <div className="space-y-1 bg-[#FFFBF4] px-2 py-3 sm:px-3">
                    <button
                        onClick={() => {
                            setShowScheduleModal(true);
                        }}
                        className="block cursor-pointer px-3 py-2 text-sm font-medium text-slate-600 hover:text-first"
                    >
                        Cek Jadwal
                    </button>

                    <button
                        onClick={() => setModalInfo(instruction_image ?? null)}
                        className="block cursor-pointer px-3 py-2 text-sm font-medium text-slate-600 hover:text-first"
                    >
                        Cara Pemesanan
                    </button>
                    <button
                        onClick={() => setModalInfo(tnc_image ?? null)}
                        className="block cursor-pointer px-3 py-2 text-sm font-medium text-slate-600 hover:text-first"
                    >
                        Syarat & Ketentuan
                    </button>
                    <a
                        href={`https://wa.me/${formatWhatsAppNumber(whatsapp_number ?? '628877935678')}?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block cursor-pointer px-3 py-2 text-sm font-medium text-slate-600 hover:text-first"
                    >
                        Kontak
                    </a>
                    <a
                        href={`/form`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block cursor-pointer px-3 py-2 text-sm font-medium text-slate-600 hover:text-first"
                    >
                        <ShoppingBag className="-mt-1 inline-block h-5 w-5" />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
