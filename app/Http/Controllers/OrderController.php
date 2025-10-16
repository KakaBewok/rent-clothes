<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function show(Product $product, Request $request)
    {
        $setting = AppSetting::first();

        return Inertia::render('front-end/order-page', 
            compact('product', 'setting')
        );
    }
}
