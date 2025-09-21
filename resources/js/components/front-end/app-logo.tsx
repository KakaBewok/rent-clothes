import { AppSetting } from '@/types/models';
import { Link } from '@inertiajs/react';

const AppLogo = ({ setting }: { setting: AppSetting }) => {
    return (
        <Link href="/">
            <div className="flex-shrink-0">
                {setting.app_logo ? (
                    <img src={`/storage/${setting.app_logo}`} width={50} height={50} alt="App Logo" className="rounded object-cover" />
                ) : (
                    <h1 className="text-2xl font-bold text-gray-700">{setting.app_name}</h1>
                )}
            </div>
        </Link>
    );
};

export default AppLogo;
