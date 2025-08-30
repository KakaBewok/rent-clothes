<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Size>
 */
class SizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'size' => $this->faker->randomElement(['XS', 'S', 'M', 'L', 'XL']),
            'quantity' => $this->faker->numberBetween(1, 10),
            'availability' => $this->faker->randomElement(['Out of Stock', 'In Stock']),
        ];
    }
}
