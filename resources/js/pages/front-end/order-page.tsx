import { AppSetting, Product } from '@/types/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import OrderForm from '../../components/front-end/order/order-form';
import OrderPreview from '../../components/front-end/order/order-preview';

interface CreateOrderPageProps {
    setting: AppSetting;
    product: Product;
}

const CreateOrderPage = ({ setting, product }: CreateOrderPageProps) => {
    const [formData, setFormData] = useState<any>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleSubmit = (data: any) => {
        setFormData(data);
        setShowPreview(true);
    };

    const handleConfirm = () => {
        router.post('/orders', formData, {
            onSuccess: () => {
                const message = encodeURIComponent(
                    `Halo kak, saya ${formData.name} ingin menyewa dress berikut:\n\n` +
                        formData.items
                            .map(
                                (item: any) =>
                                    `- ${item.product?.name} (${item.size?.size})\nTanggal pakai: ${item.use_by_date}\nDurasi: ${item.rent_periode} hari`,
                            )
                            .join('\n\n'),
                );
                window.open(`https://wa.me/<NOMOR_ADMIN>?text=${message}`, '_blank');
            },
        });
    };

    return (
        <div className="flex h-full w-full items-center justify-center bg-white">
            {!showPreview ? (
                <OrderForm onSubmit={handleSubmit} setting={setting} product={product} />
            ) : (
                <OrderPreview data={formData} onBack={() => setShowPreview(false)} onConfirm={handleConfirm} />
            )}
        </div>
    );
};

export default CreateOrderPage;
