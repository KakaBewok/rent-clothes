<?php

namespace Database\Seeders;

use App\Models\Banner;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\BannerImage;
use App\Models\Branch;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PriceDetail;
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

        // Banner + BannerImage
        Banner::factory(5)
            ->create()
            ->each(function ($banner) {
                BannerImage::factory(3)
                    ->recycle([$banner])
                    ->create();
            });

        // Master data
        Brand::factory(5)->create();
        Color::factory(10)->create();
        Type::factory(5)->create();
        Branch::factory(3)->create();

        // Product
        $products = Product::factory(10)->create();

        Size::factory(3)
            ->recycle($products)
            ->create();

        ProductGallery::factory(20)
            ->recycle($products)
            ->create();

        PriceDetail::factory(10)
            ->recycle($products)
            ->create();

        $orders = Order::factory(5)->create();

        OrderItem::factory(2)
            ->recycle($orders)
            ->recycle($products)
            ->create();
    }
}
