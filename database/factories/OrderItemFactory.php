<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'size_id' => Size::factory(),
            'shipping' => $this->faker->randomElement(['Next Day', 'Same Day', 'Regular']),
            'rent_periode' => $this->faker->numberBetween(1, 7),
            'rent_price' => $this->faker->numberBetween(50000, 300000),
            'deposit' => $this->faker->numberBetween(20000, 100000),
            'use_by_date' => $this->faker->dateTimeBetween('+1 days', '+10 days'),
            'estimated_delivery_date' => $this->faker->dateTimeBetween('+1 days', '+5 days'),
            'estimated_return_date' => $this->faker->dateTimeBetween('+6 days', '+12 days'),
        ];
    }
}
