<?php

namespace App\Models;

use App\Models\Order;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'size_id',
        'shipping',
        'rent_periode',
        'quantity',
        'type',
        'rent_price',
        'deposit',
        'use_by_date',
        'estimated_delivery_date',
        'estimated_return_date',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->withDefault([
            'name' => '--- Product data has been deleted ---',
        ]);
    }

    public function size()
    {
        return $this->belongsTo(Size::class)->withDefault([
            'size' => '--- Size data has been deleted ---',
        ]);
    }
}
