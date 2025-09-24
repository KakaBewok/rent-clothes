import { AppSetting } from '@/types/models';
import { Link } from '@inertiajs/react';

interface AppLogoProps {
    setting: AppSetting;
    logoSize?: number;
    className?: string;
}

const AppLogo = ({ setting, logoSize = 50, className }: AppLogoProps) => {
    return (
        <Link href="/" className={`${className}`}>
            <div className="flex-shrink-0">
                {setting.app_logo ? (
                    <img src={`/storage/${setting.app_logo}`} width={logoSize} height={logoSize} alt="App Logo" className="rounded object-cover" />
                ) : (
                    <h1 className="text-2xl font-bold text-gray-700">{setting.app_name ?? 'Qatiarent'}</h1>
                )}
            </div>
        </Link>
    );
};

export default AppLogo;
