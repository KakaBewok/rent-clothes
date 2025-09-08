<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Product::with(['brand', 'type', 'color', 'branch', 'priceDetail', 'sizes'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Dress Name',
            'Code',
            'Ownership',
            'Brand',
            'Type',
            'Color',
            'Branch',
            'Rent Price',
            'Discount (%)',
            'Final Price',
            'Sizes & Quantities',
            'Upload At',
        ];
    }

    public function map($product): array
    {
        // Gabungkan sizes & quantity jadi string
        $sizes = $product->sizes->map(fn($size) => "{$size->size} ({$size->quantity})")->implode(', ');

        return [
            $product->id,
            $product->name,
            $product->code,
            $product->ownership,
            $product->brand?->name,
            $product->type?->name,
            $product->color?->name,
            $product->branch?->name,
            $product->priceDetail?->rent_price,
            $product->priceDetail?->discount,
            $product->priceDetail?->price_after_discount,
            $sizes,
            $product->upload_at?->format('Y-m-d'),
        ];
    }
}
