<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

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
                        'Nama Penerima'        => $order->recipient,
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
                        'Catatan'                 => $order->desc,
                    ];
                });
            });
    }

    public function headings(): array
    {
        return [
            'Pelanggan',
            'Nama Penerima',
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
            'Catatan'
        ];
    }

    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_TEXT,
        ];
    }
}