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
                        'Order ID'           => $order->id,
                        'Customer Name'      => $order->name,
                        'Phone Number'       => $order->phone_number,
                        'Address'            => $order->address,
                        'Product'            => $item->product?->name,
                        'Size'               => $item->size?->size,
                        'Quantity'           => $item->quantity,
                        'Use By Date'        => $item->use_by_date,
                        'Estimated Return'   => $item->estimated_return_date,
                        'Rent Price'         => $item->rent_price,
                        'Deposit'            => $item->deposit,
                        'Status'             => ucfirst($order->status),
                        'Created At'         => $order->created_at->format('Y-m-d H:i:s'),
                    ];
                });
            });
    }

    public function headings(): array
    {
        return [
            'Order ID',
            'Customer Name',
            'Phone Number',
            'Address',
            'Product',
            'Size',
            'Quantity',
            'Use By Date',
            'Estimated Return',
            'Rent Price',
            'Deposit',
            'Status',
            'Created At',
        ];
    }
}
