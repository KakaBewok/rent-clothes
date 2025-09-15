<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class OrdersExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Order::with(['items.product', 'items.size'])
            ->get()
            ->flatMap(function ($order) {
                return $order->items->map(function ($item) use ($order) {
                    return [
                        'Pelanggan'      => $order->name,
                        'No. HP'       => $order->phone_number,
                        'Alamat'            => $order->address,
                        'Ekspedisi'         => $order->expedition,
                        'Status'             => ucfirst($order->status),
                        'Produk'            => $item->product?->name,
                        'Pemilik'         => $item->product?->ownership,
                        'Tipe' => $item->type,
                        'Omset'         => $item->rent_price,
                        'Tanggal kirim'        => $item->estimated_delivery_date,
                        'Tanggal pakai'        => $item->use_by_date,
                        'Tanggal pengembalian'   => $item->estimated_return_date,
                    ];
                });
            });
    }

    public function headings(): array
    {
        return [
            'Pelanggan',
            'No. HP',
            'Alamat',
            'Ekspedisi',
            'Status',
            'Produk',
            'Pemilik',
            'Tipe',
            'Omset',
            'Tanggal kirim',
            'Tanggal pakai',
            'Tanggal pengembalian',

        ];
    }
}
