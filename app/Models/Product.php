<?php

namespace App\Models;

use App\Models\Brand;
use App\Observers\ProductObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([ProductObserver::class])]
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cover_image',
        'brand_id',
        'code',
        'color_id',
        'type_id',
        'additional_ribbon',
        'branch_id',
        'ownership',
        'rent_periode',
        'upload_at',
        'description',
        'images',
    ];

    protected $casts = [
        'upload_at' => 'datetime',
        'images' => 'array',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function priceDetail()
    {
        return $this->hasOne(PriceDetail::class);
    }

    public function sizes()
    {
        return $this->hasMany(Size::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
