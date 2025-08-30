<?php

namespace Database\Seeders;

use App\Models\Banner;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Branch;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductGallery;
use App\Models\Size;
use App\Models\Type;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('rahasiabanget'),
        ]);

        Brand::factory(5)->create();
        Banner::factory(3)->create();
        Color::factory(10)->create();
        Type::factory(5)->create();
        Branch::factory(3)->create();

        $products = Product::factory(10)->create();

        foreach ($products as $product) {
            Size::factory(3)->create(['product_id' => $product->id]);
            ProductGallery::factory(4)->create(['product_id' => $product->id]);
        }

        $orders = Order::factory(5)->create();

        foreach ($orders as $order) {
            OrderItem::factory(2)->create(['order_id' => $order->id]);
        }
    }
}
