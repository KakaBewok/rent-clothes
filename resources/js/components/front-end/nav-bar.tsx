import { AppSetting } from '@/types/models';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '../front-end/app-logo';

const NavBar = ({ setting }: { setting: AppSetting }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    return (
        <nav className="sticky top-0 z-40 bg-white">
            <div className="mx-auto flex h-20 w-full items-center px-4">
                <AppLogo setting={setting} />

                {/* nav: tablet & desktop */}
                <div className="mx-auto hidden space-x-8 md:flex">
                    <Link href="#" className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first">
                        Cek Jadwal
                    </Link>
                    <Link href="#" className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first">
                        Cara Pemesanan
                    </Link>
                    <Link href="#" className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first">
                        Syarat & Ketentuan
                    </Link>
                    <Link href="#" className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:text-first">
                        Kontak
                    </Link>
                </div>

                {/* mobile menu button */}
                <div className="ml-auto cursor-pointer md:hidden">
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
            </div>

            {/* nav: mobile */}
            <div
                className={`transform transition-all duration-300 ease-in-out md:hidden ${
                    isMenuOpen ? 'max-h-96 scale-100 opacity-100' : 'max-h-0 scale-95 opacity-0'
                } overflow-hidden`}
            >
                <div className="space-y-1 bg-third px-2 py-3 sm:px-3">
                    <Link href="#" className="block cursor-pointer px-3 py-2 text-sm font-semibold text-slate-700 hover:text-first">
                        Cek Jadwal
                    </Link>
                    <Link href="#" className="block cursor-pointer px-3 py-2 text-sm font-semibold text-slate-700 hover:text-first">
                        Cara Pemesanan
                    </Link>
                    <Link href="#" className="block cursor-pointer px-3 py-2 text-sm font-semibold text-slate-700 hover:text-first">
                        Syarat & Ketentuan
                    </Link>
                    <Link href="#" className="block cursor-pointer px-3 py-2 text-sm font-semibold text-slate-700 hover:text-first">
                        Kontak
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
