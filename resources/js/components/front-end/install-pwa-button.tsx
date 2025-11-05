import { Download, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState<boolean>(false);
    const [isFirefox, setIsFirefox] = useState<boolean>(false);
    const [isIOS, setIsIOS] = useState<boolean>(false);
    const [showInstructions, setShowInstructions] = useState<boolean>(false);

    useEffect(() => {
        // Detect browser
        const userAgent = navigator.userAgent.toLowerCase();
        const firefox = userAgent.indexOf('firefox') > -1;
        const ios = /iphone|ipad|ipod/.test(userAgent);

        setIsFirefox(firefox);
        setIsIOS(ios);

        // is installed ?
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (!isStandalone && (firefox || ios)) {
            setShowInstallButton(true);
        }

        // Chrome/Edge handler
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        // Chrome/Edge - Auto Install
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                toast.success('Berhasil diinstall!', {
                    description: 'Aplikasi berhasil terpasang',
                    duration: 3000,
                });
            }

            setDeferredPrompt(null);
            setShowInstallButton(false);
        }
        // Firefox/iOS
        else {
            setShowInstructions(true);
        }
    };

    if (!showInstallButton) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="flex cursor-pointer items-center gap-1 text-slate-400 transition duration-300 hover:text-first"
            >
                <Download className="h-4 w-4" />
                Install Aplikasi
            </button>

            {/* Modals */}
            {showInstructions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* overlay */}
                    <div className="absolute inset-0 z-10 bg-black/50"></div>

                    <div className="z-40 w-full max-w-md rounded-none bg-white p-6 shadow-none">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Cara Install Aplikasi</h3>
                            <button onClick={() => setShowInstructions(false)} className="cursor-pointer text-gray-500 hover:text-gray-600">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {isFirefox && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600">
                                    <strong>Firefox Desktop:</strong>
                                </p>
                                <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700">
                                    <li>
                                        Firefox desktop tidak support instalasi PWA (<span className="italic">Progressive Web App</span>)
                                    </li>
                                    <li>Gunakan Chrome, Edge atau Opera untuk install</li>
                                    <li>
                                        Atau akses dari <strong>Firefox Android</strong>
                                    </li>
                                </ol>

                                <p className="mt-4 text-sm text-gray-600">
                                    <strong>Firefox Android:</strong>
                                </p>
                                <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700">
                                    <li>
                                        Tap menu <strong>⋮</strong> (3 titik) di pojok kanan atas
                                    </li>
                                    <li>
                                        Pilih <strong>"Install"</strong> atau <strong>"Add to Home screen"</strong>
                                    </li>
                                    <li>
                                        Tap <strong>"Add"</strong> atau <strong>"Install"</strong>
                                    </li>
                                </ol>
                            </div>
                        )}

                        {isIOS && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600">
                                    <strong>Cara Install di iPhone/iPad/IOS:</strong>
                                </p>
                                <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700">
                                    <li>
                                        Tap tombol <strong>Share</strong> (kotak dengan panah ke atas)
                                    </li>
                                    <li>
                                        Scroll ke bawah, tap <strong>"Add to Home Screen"</strong>
                                    </li>
                                    <li>Edit nama aplikasi (opsional)</li>
                                    <li>
                                        Tap <strong>"Add"</strong>
                                    </li>
                                </ol>
                            </div>
                        )}

                        <button
                            onClick={() => setShowInstructions(false)}
                            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-none bg-slate-700 py-2 text-white shadow-none transition-all duration-300 hover:bg-slate-800"
                        >
                            Mengerti
                            <ThumbsUp className="mb-[2px] h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
