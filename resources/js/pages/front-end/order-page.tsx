import { AppSetting, Product } from '@/types/models';
import OrderForm from '../../components/front-end/order/order-form';

interface CreateOrderPageProps {
    setting: AppSetting;
    product: Product;
}

const CreateOrderPage = ({ setting, product }: CreateOrderPageProps) => {
    return (
        <div className="flex h-full w-full items-center justify-center bg-white">
            <OrderForm setting={setting} product={product} />
        </div>
    );
};

export default CreateOrderPage;
