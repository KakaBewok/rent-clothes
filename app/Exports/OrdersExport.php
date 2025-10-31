<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

// class OrdersExport implements FromCollection, WithHeadings
// {
//     public function collection()
//     {
//         return Order::with(['items.product', 'items.size'])
//             ->get()
//             ->flatMap(function ($order) {
//                 return $order->items->map(function ($item) use ($order) {
//                     return [
//                         'Pelanggan'      => $order->name,
//                         'Produk'            => $item->product?->name,
//                         'No. HP'       => $order->phone_number,
//                         'Alamat'            => $order->address,
//                         'Ekspedisi'         => $order->expedition,
//                         'Status'             => ucfirst($order->status),
//                         'Pemilik'         => $item->product?->ownership,
//                         'Tipe' => $item->type,
//                         'Omset'         => $item->rent_price,
//                         'Tanggal kirim'        => $item->estimated_delivery_date,
//                         'Tanggal pakai'        => $item->use_by_date,
//                         'Tanggal pengembalian'   => $item->estimated_return_date,
//                     ];
//                 });
//             });
//     }


class OrdersExport implements FromCollection, WithHeadings
{
    protected $query;

    public function __construct($query)
    {
        $this->query = $query;
    }

    public function collection()
    {
        return $this->query
            ->with(['items.product', 'items.size'])
            ->get()
            ->flatMap(function ($order) {
                return $order->items->map(function ($item) use ($order) {
                    return [
                        'Pelanggan'            => $order->name,
                        'Produk'               => $item->product?->name,
                        'No. HP'               => "\t" . $order->phone_number,
                        'Alamat'               => $order->address,
                        'Ekspedisi'            => $order->expedition,
                        'Status'               => ucfirst($order->status),
                        'Pemilik'              => $item->product?->ownership,
                        'Tipe'                 => $item->type,
                        'Omset'                => $item->rent_price,
                        'Tanggal kirim'        => $item->estimated_delivery_date,
                        'Tanggal pakai'        => $item->use_by_date,
                        'Tanggal pengembalian' => $item->estimated_return_date,
                    ];
                });
            });
    }

    public function headings(): array
    {
        return [
            'Pelanggan',
            'Produk',
            'No. HP',
            'Alamat',
            'Ekspedisi',
            'Status',
            'Pemilik',
            'Tipe',
            'Omset',
            'Tanggal kirim',
            'Tanggal pakai',
            'Tanggal pengembalian',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_TEXT, // kolom ke-3 = No. HP
        ];
    }
}



//     public function headings(): array
//     {
//         return [
//             'Pelanggan',
//             'Produk',
//             'No. HP',
//             'Alamat',
//             'Ekspedisi',
//             'Status',
//             'Pemilik',
//             'Tipe',
//             'Omset',
//             'Tanggal kirim',
//             'Tanggal pakai',
//             'Tanggal pengembalian',

//         ];
//     }
// }