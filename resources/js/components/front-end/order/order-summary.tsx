'use client';

import { Product } from '@/types/models';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { OrderItemData } from './order-form';

interface OrderSummaryProps {
    fields: { id: string }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watch: UseFormWatch<any>;
    getSelectedProduct: (item: OrderItemData, index: number) => Product | undefined;
    addDays: (date: Date, days: number) => Date;
    subDays: (date: Date, days: number) => Date;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ fields, watch, getSelectedProduct, addDays, subDays }) => {
    return (
        <div className="mt-14 border border-slate-300 bg-slate-100 p-3 md:p-5">
            <h3 className="border-b border-slate-300 pb-2 text-lg font-semibold text-slate-700">Detail Pesanan</h3>

            <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-slate-700">
                <p className="font-semibold">Nama</p>
                <p>: {watch('name') || '-'}</p>

                <p className="font-semibold">No. Telepon</p>
                <p>: {watch('phone_number') || '-'}</p>

                <p className="font-semibold">Ekspedisi</p>
                <p>: {watch('expedition') || '-'}</p>

                <p className="font-semibold">Alamat</p>
                <p>: {watch('address') || '-'}</p>

                <p className="font-semibold">Provider</p>
                <p>: {watch('provider_name') || '-'}</p>

                <p className="font-semibold">No. Rekening</p>
                <p>: {watch('account_number') || '-'}</p>

                <p className="font-semibold">Catatan</p>
                <p>: {watch('desc') || '-'}</p>
            </div>

            {/* items */}
            <div className="mt-4 rounded-none border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 md:p-5">
                <h4 className="mb-2 font-semibold">Item yang Disewa</h4>

                {fields.length > 0 ? (
                    <ul className="space-y-2 md:space-y-4">
                        {fields.map((field, index) => {
                            const item = watch(`items.${index}`);
                            const product = getSelectedProduct(item, index);
                            const size = product?.sizes?.find((s) => s.id === item?.size_id)?.size ?? '-';
                            // const type = product?.types?.find((t) => t.id === item?.type_id)?.name ?? '-';
                            const estimatedReturn = item.use_by_date && item.rent_periode ? addDays(item.use_by_date, item.rent_periode) : null;
                            const estimatedDelivery =
                                item.use_by_date && item.shipping ? subDays(item.use_by_date, item.shipping === 'Same day' ? 1 : 2) : null;

                            return (
                                <li key={field.id} className="rounded-none border border-slate-200 bg-white p-3">
                                    <p className="mb-4 border-b border-slate-200 pb-3 font-semibold">Item {index + 1}</p>

                                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-slate-700">
                                        <p className="font-semibold">Produk</p>
                                        <p>: {product?.name ? `${product?.name} - ${product?.brand?.name} (${product?.code})` : '-'}</p>

                                        <p className="font-semibold">Ukuran</p>
                                        <p>: {size}</p>

                                        <p className="font-semibold">Tipe</p>
                                        <p>: {item.type ?? '-'}</p>

                                        <p className="font-semibold">Jumlah</p>
                                        <p>: {item?.quantity ?? 1}</p>

                                        <p className="font-semibold">Lama Sewa</p>
                                        <p>: {item?.rent_periode ?? 1} hari</p>

                                        <p className="font-semibold">Tipe Pengiriman</p>
                                        <p>: {item?.shipping ?? '-'}</p>

                                        <p className="font-semibold">Pengiriman</p>
                                        <p>: {estimatedDelivery ? format(estimatedDelivery, 'dd MMMM yyyy', { locale: id }) : '-'}</p>

                                        <p className="font-semibold">Tanggal Digunakan</p>
                                        <p>: {item?.use_by_date ? format(item.use_by_date, 'dd MMMM yyyy', { locale: id }) : '-'}</p>

                                        <p className="font-semibold">Pengembalian</p>
                                        <p>: {estimatedReturn ? format(estimatedReturn, 'dd MMMM yyyy', { locale: id }) : '-'}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Tidak ada item yang ditambahkan.</p>
                )}
            </div>
        </div>
    );
};

export default OrderSummary;
