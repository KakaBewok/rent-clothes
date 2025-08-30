<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'rent_price',
        'deposit',
        'discount',
        'price_after_discount',
        'additional_time_price',
        'additional_ribbon',
        'type_id'
    ];

    public static function boot()
    {
        parent::boot();

        static::saving(function ($detail) {
            $detail->price_after_discount =
                $detail->rent_price - ($detail->rent_price * $detail->discount / 100);
        });
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function product()
    {
        return $this->hasOne(Product::class, 'price_detail_id');
    }
}
