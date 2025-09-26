<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        $product->load([
            'brand',
            'types',
            'color',
            'branch',
            'priceDetail',
            'sizes',
        ]);
        
        return response()->json($product);
    }
}
