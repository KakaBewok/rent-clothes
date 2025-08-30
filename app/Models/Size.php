<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'size', 'quantity', 'availability'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
