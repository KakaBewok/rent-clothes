<?php

namespace App\Models;

use App\Models\PriceDetail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Type extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'desc'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($type) {
            $type->slug = Str::slug($type->name);
        });
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function banners()
    {
        return $this->hasMany(Banner::class);
    }
}
