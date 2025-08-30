<?php

namespace App\Models;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cover_image',
        'brand_id',
        'code',
        'color_id',
        'branch_id',
        'ownership',
        'rent_periode',
        'upload_at',
        'description',
        'price_detail_id',
    ];

    protected $dates = ['upload_at'];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
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
        return $this->belongsTo(PriceDetail::class);
    }

    public function sizes()
    {
        return $this->hasMany(Size::class);
    }

    public function galleries()
    {
        return $this->hasMany(ProductGallery::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
